Vue.component('variable-edit', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component variable-create">
        <div class="title">
            <span style="color: #a1a0a0;">变量管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('message-list')">变量列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            修改变量
        </div>
        <el-row class="nav" :gutter="20">
          <el-col :span="24" class="nav-title">修改变量</el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--表单-->
        <el-form :model="form" ref="form" :rules="rules" label-width="120px">
            <div class="scrollable-area">
               <div class="card-attr">基本信息</div>
               <el-row :gutter="20" class="card-attr-row" style="margin-top: 10px">
                  <el-col :span="6">
                     <el-form-item label="变量名称" prop="variableName">
                         <el-input v-model="form.variableName" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="变量编码" prop="variableCode">
                         <el-input v-model="form.variableCode" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="寄存器地址" prop="registerAddress">
                         <el-input v-model="form.registerAddress" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="读取长度" prop="registerLength">
                         <el-input v-model="form.registerLength" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="变量单位" prop="variableUnit">
                         <el-input v-model="form.variableUnit" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="变量类型" prop="variableType">
                         <el-input v-model="form.variableType" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="计算系数" prop="coefficient">
                         <el-input v-model="form.coefficient" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
            </div>
            <div class="scrollable-area">
                <div class="card-attr">模板设置</div>
                <el-form-item label="关联设备模板" style="margin-top: 10px">
                   <el-select v-model="form.templateId"  class="search-item" filterable clearable size="small" placeholder="请选择关联模板" @change="changeTemplate">
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
            <div class="scrollable-area">
                <div class="card-attr">报文设置</div>
                <el-form-item label="关联报文" style="margin-top: 10px">
                    <el-select v-model="form.messageId"  class="search-item" filterable clearable size="small" placeholder="请选择关联报文">
                        <el-option
                                v-for="item in messageOptions"
                                :key="item.messageId"
                                :label="item.messageName"
                                :value="item.messageId">
                        </el-option>
                    </el-select>
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
                variableId: this.data.variableId,
                variableName: this.data.variableName,
                variableCode: this.data.variableCode,
                variableType: this.data.variableType,
                variableUnit: this.data.variableUnit,
                registerAddress: this.data.registerAddress,
                registerLength: this.data.registerLength,
                templateId: this.data.templateId,
                messageId: this.data.messageId,
                coefficient: this.data.coefficient,
            },
            rules: {
                variableName: [{required: true, message: '请输入变量名称', trigger: 'blur'}],
                variableCode: [{required: true, message: '请输入变量编码', trigger: 'blur'}],
                registerAddress: [{required: true, message: '请输入变量寄存器地址', trigger: 'blur'}],
                registerLength: [{required: true, message: '请输入寄存器读取长度', trigger: 'blur'}],
            },
            templateOptions: [],
            messageOptions: [],
        }
    },
    created() {
        // 获取模板下拉框
        this.getTemplateOptions()
        // 获取报文下拉框
        this.getMessageOptions()
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
        // 获取报文列表
        async getMessageOptions() {
            try {
                const response = await axios.get("/api/message/getList",{
                    params: { templateId: this.form.templateId }
                });
                this.messageOptions = response.data.data;
            } catch (error) {
                console.error("获取列表异常:", error);
            }
        },
        // 选择模板ID
        changeTemplate(){
            this.getMessageOptions()
        },
        // 提交表单
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    // 调用新增接口
                    axios.post('/api/variable/edit', this.form)
                        .then(response => {
                            this.$message.success("修改成功");
                            // 跳转回网关分页
                            this.linkPage('variable-list')
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