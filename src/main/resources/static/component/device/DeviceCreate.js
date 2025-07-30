Vue.component('device-create', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component device-create">
        <div class="title">
            <span style="color: #a1a0a0;">设备管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('device-list')">设备列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            添加设备
        </div>
        <el-row class="nav" :gutter="20">
          <el-col :span="24" class="nav-title">添加网关</el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--新增表单-->
        <el-form :model="form" ref="form" :rules="rules" label-width="120px">
            <div class="scrollable-area">
               <div class="card-attr">基本信息</div>
               <el-row :gutter="20" class="card-attr-row" style="margin-top: 10px">
                  <el-col :span="6">
                     <el-form-item label="设备名称" prop="deviceName">
                         <el-input v-model="form.deviceName" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="设备编码" prop="deviceCode">
                         <el-input v-model="form.deviceCode" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="十进制地址位" prop="deviceAddressBit">
                         <el-input v-model="form.deviceAddressBit" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="设备编号" prop="deviceNumber">
                         <el-input v-model="form.deviceNumber" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="设备类型" prop="deviceType">
                         <el-input v-model="form.deviceType" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="设备状态" prop="deviceStatus">
                         <el-input v-model="form.deviceStatus" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="电流变比" prop="ctRatio">
                         <el-input v-model="form.ctRatio" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="电压变比" prop="ptRatio">
                         <el-input v-model="form.ptRatio" size="small" class="create-form-item"></el-input>
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
            <div class="scrollable-area">
               <div class="card-attr">网关设置</div>
                  <el-form-item label="关联设备网关" style="margin-top: 10px">
                      <el-select v-model="form.gatewayId"  class="search-item" filterable clearable size="small" placeholder="请选择关联网关">
                          <el-option
                                  v-for="item in gatewayOptions"
                                  :key="item.gatewayId"
                                  :label="item.gatewayName"
                                  :value="item.gatewayId">
                          </el-option>
                      </el-select>
                  </el-form-item>
            </div>
            <div style="width: 50%">
                <el-form-item style="text-align: center; margin-top: 30px">
                    <el-button type="primary" @click="submitForm">立即创建</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
    `,
    data() {
        return {
            form: {
                gatewayId: '',
                templateId: '',
                deviceName: '',
                deviceAddressBit: '',
                deviceCode: '',
                deviceNumber: '',
                deviceType: '',
                deviceStatus: '',
                ctRatio: '',
                ptRatio: '',
                templateName: '',
                templateCode: '',
            },
            rules: {
                deviceName: [{required: true, message: '请输入设备名称', trigger: 'blur'}],
                deviceCode: [{required: true, message: '请输入设备编码', trigger: 'blur'}],
                deviceAddressBit: [{required: true, message: '请输入十进制地址位', trigger: 'blur'}],
            },
            gatewayOptions: [],
            templateOptions: [],
        }
    },
    created() {
        // 获取网关下拉框
        this.getGatewayOptions()
        // 获取模板下拉框
        this.getTemplateOptions()
    },
    methods: {
        // 获取网关列表
        async getGatewayOptions() {
            try {
                const response = await axios.get("/api/gateway/getAllList");
                this.gatewayOptions = response.data.data;
            } catch (error) {
                console.error("获取列表异常:", error);
            }
        },
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
                    axios.post('/api/device/add', this.form)
                        .then(response => {
                            this.$message.success("新增成功");
                            // 清空表单
                            this.resetForm();
                            // 跳转回网关分页
                            this.linkPage('device-list')
                        })
                        .catch(error => {
                            this.$message.error("新增失败: " + error.message);
                        });
                } else {
                    console.log('表单验证失败');
                    return false;
                }
            });
        },
        // 重置表单
        resetForm() {
            this.$refs['form'].resetFields();
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