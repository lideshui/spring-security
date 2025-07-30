Vue.component('message-edit', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component message-create">
        <div class="title">
            <span style="color: #a1a0a0;">报文管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('message-list')">报文列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            修改报文
        </div>
        <el-row class="nav" :gutter="20">
          <el-col :span="24" class="nav-title">修改报文</el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--新增表单-->
        <el-form :model="form" ref="form" :rules="rules" label-width="120px">
            <div class="scrollable-area">
               <div class="card-attr">基本信息</div>
               <el-row :gutter="20" class="card-attr-row" style="margin-top: 10px">
                  <el-col :span="6">
                     <el-form-item label="报文名称" prop="messageName">
                         <el-input v-model="form.messageName" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="报文内容" prop="requestMessage">
                         <el-input v-model="form.requestMessage" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="报文长度" prop="requestLength">
                         <el-input v-model="form.requestLength" size="small" class="create-form-item" disabled></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
            </div>
            <div class="scrollable-area">
               <div class="card-attr">模板设置</div>
                  <el-form-item label="关联设备模板" style="margin-top: 10px">
                     <el-select v-model="form.templateId"  class="search-item" filterable clearable size="small" placeholder="请选择关联模板">
                         <el-option
                                 v-for="item in templateOptions"
                                 :key="item.templateId"
                                 :label="item.templateName"
                                 :value="item.templateId">
                         </el-option>
                     </el-select>
                     <el-tooltip class="item" effect="dark" content="设备模板：所有关联设备模板的设备都将基于此模板规则发送报文和解析响应。" placement="top">
                        <i style="color: #bfbfbf; font-size: 16px; line-height: 16px;" class="el-icon-question"></i>
                     </el-tooltip>
                  </el-form-item>
            </div>
            <div style="width: 50%">
                <el-form-item style="text-align: center; margin-top: 30px">
                    <el-button type="primary" @click="submitForm">立即保存</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
    `,
    data() {
        return {
            form: {
                messageId: this.data.messageId,
                templateId: this.data.templateId,
                messageName: this.data.messageName,
                requestMessage: this.data.requestMessage,
                requestLength: this.data.requestLength,
            },
            rules: {
                messageName: [{required: true, message: '请输入报文名称', trigger: 'blur'}],
                requestMessage: [{required: true, message: '请输入报文内容', trigger: 'blur'}],
            },
            templateOptions: [],
        }
    },
    created() {
        // 获取模板下拉框
        this.getTemplateOptions()
    },
    watch: {
        // 监听 form.requestMessage 的变化
        'form.requestMessage': {
            handler(newValue) {
                if (newValue.length >= 2) {
                    // 提取最后两位字符
                    const lastTwoChars = newValue.slice(-2);
                    // 尝试将最后两位十六进制字符转换为十进制
                    try {
                        this.form.requestLength = parseInt(lastTwoChars, 16)*2;
                    } catch (error) {
                        console.error("转换失败:", error);
                        // 可以选择重置或保持原值
                        this.form.requestLength = '';
                    }
                }
            },
        }
    },
    methods: {
        // 获取模板列表
        async getTemplateOptions() {
            try {
                const response = await axios.get("/api/template/getAllList");
                this.templateOptions = response.data.data;
            } catch (error) {
                console.error("获取列表异常:", error);
            }
        },
        // 提交表单
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    // 调用新增接口
                    axios.post('/api/message/edit', this.form)
                        .then(response => {
                            this.$message.success("修改成功");
                            // 跳转回网关分页
                            this.linkPage('message-list')
                        })
                        .catch(error => {
                            this.$message.error("修改失败: " + error.message);
                        });
                } else {
                    console.log('表单验证失败');
                    return false;
                }
            });
        },
        // 跳转页面
        linkPage(component) {
            let paramObj = {
                component: component,
                data: {}
            }
            this.$emit('change-component', paramObj);
        },
    }
})