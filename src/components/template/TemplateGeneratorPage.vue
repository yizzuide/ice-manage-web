<template>
  <div class="template-generator">
    <div v-if="isDev" class="generator-container">
      <div class="form-container">
        <h3>元数据配置</h3>
        <el-form :model="metadata" label-width="120px">
          <el-form-item label="模板选择">
            <el-select v-model="selectedTemplate" placeholder="请选择模板">
              <el-option
                v-for="template in templates"
                :key="template.id"
                :label="template.name"
                :value="template.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模块名称">
            <el-input v-model="metadata.moduleName" placeholder="请输入模块名称（例如：User）" @blur="loadTemplateFiles"></el-input>
          </el-form-item>

          <!-- TS实体代码输入框，仅前端模板显示 -->
          <el-form-item v-if="selectedTemplate === 'front'" label="TS实体代码">
            <el-input type="textarea" v-model="metadata.entity" placeholder="interface User { ... }"></el-input>
          </el-form-item>

          <!-- 包名输入框，仅后端模板显示 -->
          <el-form-item v-if="selectedTemplate === 'back'" label="包名">
            <el-input v-model="metadata.package" placeholder="请输入包名（例如：com.example）"></el-input>
          </el-form-item>

          <!-- 可以根据需要添加更多表单项 -->
          <el-form-item label="搜索字段配置" v-if="selectedTemplate === 'front'">
            <div class="search-fields">
              <el-button @click="addField" type="primary" plain size="small">添加</el-button>
              <div v-for="(item, index) in metadata.searchFields" :key="index" class="search-item">
                <el-input v-model="item.keyName" placeholder="字段名" class="search-input"></el-input>
                <el-button @click="removeField(index)" type="danger" :icon="Delete" circle size="small"></el-button>
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="generateTemplate" :loading="generating">下载模板</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="preview-container">
        <h3>预览</h3>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="元数据" name="metadata">
            <pre>{{ JSON.stringify(metadata, null, 2) }}</pre>
          </el-tab-pane>
          <el-tab-pane label="生成结果" name="result">
            <div v-if="previewFiles.length > 0">
              <div v-for="(file, index) in previewFiles" :key="index" class="preview-file">
                <h4>{{ file.name }}</h4>
                <pre>{{ file.content }}</pre>
              </div>
            </div>
            <el-empty v-else description="暂无预览内容"></el-empty>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";
import { Delete} from "@element-plus/icons-vue";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Handlebars from "handlebars";

// 判断是否为开发环境
const isDev = computed(() => {
  return import.meta.env.MODE === "dev";
});

// 模板数据
const templates = [
  { id: "front", name: "Vue前端组件" },
  { id: "back", name: "Java后端控制器" },
];

// 配置元数据
const metadata = reactive({
  moduleName: "",
  package: "",
  entity: "",
  searchFields: [] as { keyName: string; }[],
});

const selectedTemplate = ref("");
const generating = ref(false);
const activeTab = ref("metadata");
const previewFiles = ref<{ name: string; content: string }[]>([]);

// 模板内容存储对象
const templateContents = reactive<Record<string, Record<string, string>>>({});

// 从本地加载模板文件
async function loadTemplateFiles() {
  try {
    // 加载前端模板
    const frontPage = await import("./templates/front/page.hbs?raw");
    const configListPage = await import("./templates/front/config/list-page.hbs?raw");
    const configDataDialog= await import("./templates/front/config/data-dialog.hbs?raw");
    const frontStore = await import("./templates/front/store/store.hbs?raw");

    // 加载后端模板
    const backController = await import("./templates/back/controller.hbs?raw");

    // 设置模板内容
    const moduleName = convertCamelCase(metadata.moduleName);
    templateContents["front"] = {
      [`${moduleName}Page.vue`]: frontPage.default,
      [`config/${moduleName}-list-page.ts`]: configListPage.default,
      [`config/${moduleName}-data-dialog.ts`]: configDataDialog.default,
      [`store/${moduleName}Store.ts`]: frontStore.default
    };

    // 设置后端模板内容
    templateContents["back"] = {
      [`${metadata.moduleName}Controller.java`]: backController.default
    };
  } catch (error) {
    console.error("加载模板文件失败:", error);
    ElMessage.error("加载模板文件失败，请检查控制台错误信息");
  }
}

// 添加模块
function addField() {
  metadata.searchFields.push({ keyName: "" });
}

// 移除模块
function removeField(index: number) {
  metadata.searchFields.splice(index, 1);
}

// 重置表单
function resetForm() {
  Object.assign(metadata, {
    moduleName: "",
    package: "",
    entity: "",
    searchFields: [],
  });
  selectedTemplate.value = "";
  previewFiles.value = [];
}

// 注册 Handlebars 辅助函数
Handlebars.registerHelper("kebabCase", function(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
});

function convertCamelCase(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
Handlebars.registerHelper("camelCase", convertCamelCase);

Handlebars.registerHelper("pascalCase", function(str) {
  const text = str.replace(/-([a-z])/g, function(g: string) { return g[1].toUpperCase(); });
  return text.charAt(0).toUpperCase() + text.slice(1);
});

// 生成模板
async function generateTemplate() {
  if (!selectedTemplate.value) {
    ElMessage.warning("请选择模板");
    return;
  }

  // 检查模板内容是否已加载
  if (!templateContents[selectedTemplate.value] ||
      Object.keys(templateContents[selectedTemplate.value]).length === 0) {
    ElMessage.warning("模板内容尚未加载完成，请稍后再试");
    return;
  }

  if (!metadata.moduleName) {
    ElMessage.warning("请输入模块名称");
    return;
  }
  if (!metadata.entity && selectedTemplate.value === "front") {
    ElMessage.warning("请输入TS实体代码");
    return;
  }

  generating.value = true;

  try {
    const templateFiles = templateContents[selectedTemplate.value];
    const zip = new JSZip();

    // 清空预览文件
    previewFiles.value = [];

    // 过滤空的搜索字段
    metadata.searchFields = metadata.searchFields.filter(field => field.keyName.trim() !== "");

    // 检查后端模板是否设置了包名
    if (selectedTemplate.value === "back" && !metadata.package) {
      metadata.package = "com.example";
    }

    let zipFileName = "";
    // 处理每个模板文件
    for (const [fileName, content] of Object.entries(templateFiles)) {
      const template = Handlebars.compile(content);
      const renderedContent = template(metadata);

      // 添加到 zip
      if (selectedTemplate.value === "front") {
        // 前端模板保持原有逻辑，包含目录结构
        const folderName = convertCamelCase(metadata.moduleName);
        const folder = zip.folder(folderName);

        if(fileName.includes("/")) {
          const [folderName, newfileName] = fileName.split("/");
          folder?.folder(folderName)?.file(newfileName, renderedContent);
        } else {
          folder?.file(fileName, renderedContent);
        }

        // 生成 zip 文件名
        zipFileName = `${folderName}Component.zip`;
      } else {
        // 后端模板直接添加文件，不包含目录结构
        zip.file(fileName, renderedContent);

        // 生成 zip 文件名
        zipFileName = `${metadata.moduleName}Controller.zip`;
      }

      // 添加到预览
      previewFiles.value.push({
        name: fileName,
        content: renderedContent
      });
    }

    // 生成 zip 文件
    const zipContent = await zip.generateAsync({ type: "blob" });
    saveAs(zipContent, zipFileName);

    // 切换到预览标签
    activeTab.value = "result";

    ElMessage.success("模板生成成功");
  } catch (error) {
    console.error("生成模板失败:", error);
    ElMessage.error("生成模板失败");
  } finally {
    generating.value = false;
  }
}
</script>

<style scoped lang="scss">
.template-generator {
  padding: 20px;

  .generator-container {
    display: flex;
    margin-top: 20px;
    gap: 20px;

    .form-container, .preview-container {
      width: 50%;
      padding: 20px;
      border-radius: 4px;
      background-color: $panelBgColor;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .search-fields{
      flex-direction: row;

      .search-item {
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 10px;
        gap: 10px;

        .search-input {
          width: 180px;
          margin-right: 10px;
        }
      }
    }


    pre {
      background-color: $drawerBgColor;
      padding: 10px;
      border-radius: 4px;
      overflow: auto;
      font-family: monospace;
      color: #eee;
    }

    .preview-file {
      margin-bottom: 20px;

      h4 {
        margin-bottom: 5px;
        color: $primaryColor;
      }
    }
  }
}
</style>
