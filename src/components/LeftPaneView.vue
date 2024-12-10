<template>
  <LeftPane :treeData="treeData" @emitData="handleEventData" @folderToShow="getFolder" />
</template>

<script>
import LeftPane from './LeftPane.vue';
import axios from 'axios';

export default {
  name: "LeftPaneView",
  props: {
    leftPaneTestSuiteUUID: {
      type: String,
      default: ''
    },
    selectedFolder: {
      type: String,
      default: ''
    }
  },
  components: {
    LeftPane
  },
  data() {
    return {
      loadSuiteData: [],
      jsonData: [],
      treeData: [],
      finalData: [],
    };
  },
  mounted() {
    this.getLeftPane();
  },
  watch: {
    selectedFolder(newValue) {
      if (newValue) {
        this.getFolder();
      }
    }
  },
  methods: {
    handleEventData(data, testSuiteUUID) {
      this.loadSuiteData = data;
      this.$emit("sendData", this.loadSuiteData, testSuiteUUID);
    },

    getFolder() {
      if (this.selectedFolder !== 'all') {
        const selectedNode = this.finalData.find(item => item.name === this.selectedFolder);
        this.treeData = selectedNode ? [selectedNode] : [];
      } else {
        this.treeData = this.finalData;
      }
    },

    convertWithParentPath(data, parentPath = '') {
      return data.map(item => ({
        ...item,
        parent_path: parentPath,
        children: item.children ? this.convertWithParentPath(item.children, `${parentPath}${item.label}/`) : []
      }));
    },

    async fetchFileDetails(node, parentLabel) {
      try {
        const folder = parentLabel === 'g30' ? 'g30/cli' : 'g40/cli';
        const apiUrl = `http://35.188.41.6:8001/api/latest-file-versions/?Content-Type=application/json&test_suite_uuid=${node.label}&userid_uuid=e5ed4652-96ea-49ba-b3bb-f84fd7&folder=${folder}`;
        const response = await axios.get(apiUrl);
        return response.data.file_details;
      } catch (error) {
        console.error('Error fetching file details', error);
      }
    },

    async getLeftPane() {
      try {
        const res = await axios.get('http://35.188.41.6:8001/api/files/?Content-Type=application/json');
        const finalRes = this.convertWithParentPath(res.data);
        this.jsonData = this.transformTreeData(finalRes);
        await this.refreshData();
        this.finalData = this.jsonData[0]?.children || []; // Use optional chaining
        this.treeData = this.finalData;
      } catch (error) {
        console.error("Error in Fetching the left Pane:: ", error);
      }
    },

    transformTreeData(originalData) {
      const result = [];
      let counter = 0;

      const traverse = (node, parentKey) => {
        const newKey = `${parentKey}-${counter++}`;
        const newNode = { ...node, key: newKey };

        if (node.children && node.children.length > 0) {
          newNode.children = node.children.map(child => traverse(child, newKey));
        } else {
          newNode.children = [];
        }

        return newNode;
      };

      originalData.forEach(child => {
        result.push(traverse(child, '0'));
      });

      return result;
    },

    async updateChildrenLabels(parentNode) {
      if (parentNode.children && parentNode.children.length) {
        const updatePromises = parentNode.children.map(async (childNode) => {
          const parentLabel = this.findRelevantParentLabel(parentNode);
          const updatedFileNames = await this.fetchFileDetails(childNode, parentLabel);
          
          if (updatedFileNames && Array.isArray(updatedFileNames)) {
                // Update the label to the name of the first child without extension
                let filenames = updatedFileNames[0].test_suite_path.split("/")[8].split(".")[0];
                if (updatedFileNames.length > 0) {
                    // Assuming the first child file's label is what you want to use
                    const firstFileName = updatedFileNames[0].test_suite_file_name;
                    const nameWithoutExtension = firstFileName.split('.').slice(0, -1).join('.'); // Remove file extension
                    childNode.label = nameWithoutExtension; // Update child node's label
                     // Set children for the child node
                    let parentPath = childNode.parent_path;
                    let test_suite_uuid_name = childNode.name; // Updated label
                    childNode.name =nameWithoutExtension;
                    childNode.children = updatedFileNames.map(fileName => ({
                        label: fileName.test_suite_file_name, // Keep original file name for children
                        parent_path:parentPath+test_suite_uuid_name+'/',
                        test_suite_uuid_name: filenames, // Example UUID naming
                    }));
                }
            }
        });
        await Promise.all(updatePromises);
      }
    },

    async refreshData() {
      const cliNodes = this.findAllCliNodes(this.jsonData);
      for (const cliNode of cliNodes) {
        await this.updateChildrenLabels(cliNode);
      }
    },

    findAllCliNodes(nodes) {
      let cliNodes = [];
      nodes.forEach(node => {
        if (node.label === 'cli') {
          cliNodes.push(node);
        }
        if (node.children && node.children.length) {
          cliNodes = cliNodes.concat(this.findAllCliNodes(node.children));
        }
      });
      return cliNodes;
    },

    findNodeByLabel(nodes, label) {
      for (const node of nodes) {
        if (node.label === label) return node;
        if (node.children && node.children.length) {
          const result = this.findNodeByLabel(node.children, label);
          if (result) return result;
        }
      }
      return null;
    },

    findRelevantParentLabel(node) {
      if (node && node.children) {
        if (node.label === 'cli') {
          return this.findParentLabel(this.jsonData, node);
        }
        for (const child of node.children) {
          const result = this.findRelevantParentLabel(child);
          if (result) return result;
        }
      }
      return null;
    },

    findParentLabel(nodes, targetNode) {
      for (const node of nodes) {
        if (node.children && node.children.includes(targetNode)) {
          return node.label;
        }
        if (node.children && node.children.length) {
          const result = this.findParentLabel(node.children, targetNode);
          if (result) return result;
        }
      }
      return null; 
    },
  }
}
</script>

<style scoped>
</style>
