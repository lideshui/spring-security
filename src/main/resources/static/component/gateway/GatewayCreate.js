Vue.component('gateway-create', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component gateway-create">
        <div class="title">
            <span style="color: #a1a0a0;">网关管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('gateway-list')">网关列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            添加网关
        </div>
        <el-row class="nav" :gutter="20">
          <el-col :span="24" class="nav-title">添加网关</el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <div class="scrollable-area" style="margin-top: 15px">
            <div class="card-attr">基本信息</div>
                <el-tag style="margin-bottom: 10px" type="warning">
                   <i style="font-size: 16px; line-height: 16px; padding-right: 5px" class="el-icon-warning"></i>
                   不推荐手动创建网关数据，陌生网关首次与服务器建立连接时会自动为该网关创建更为精准的网关信息，只对网关信息进行初始化即可！
                </el-tag>
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="网关名称" prop="gatewayName">
                          <el-input v-model="form.gatewayName" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="网关编码" prop="gatewayCode">
                          <el-input v-model="form.gatewayCode" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="IP地址" prop="gatewayIp">
                          <el-input v-model="form.gatewayIp" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="通信端口" prop="gatewayPort">
                          <el-input v-model="form.gatewayPort" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="心跳包" prop="heartbeat">
                          <el-input v-model="form.heartbeat" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="SN码" prop="gatewaySn">
                          <el-input v-model="form.gatewaySn" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="MAC地址" prop="gatewayMac">
                          <el-input v-model="form.gatewayMac" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="IMEI号" prop="gatewayImei">
                          <el-input v-model="form.gatewayImei" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="安装位置" prop="installationLocation">
                          <el-input v-model="form.installationLocation" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="网关坐标" prop="gatewayCoordinates">
                          <el-input v-model="form.gatewayCoordinates" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="网关标签" prop="gatewayTag">
                          <el-input v-model="form.gatewayTag" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="网关类型" prop="gatewayType">
                          <el-input v-model="form.gatewayType" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
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
                gatewayName: '',
                gatewayCode: '',
                gatewayIp: '',
                gatewayPort: '',
                gatewaySn: '',
                heartbeat: '',
                gatewayStatus: 1,
                gatewayMac: '',
                gatewayImei: '',
                gatewayTag: '',
                gatewayType: '',
                gatewayCoordinates: '',
                installationLocation: '',
            },
            rules: {
                gatewayName: [{required: true, message: '请输入网关名称', trigger: 'blur'}],
                gatewayCode: [{required: true, message: '请输入网关编码', trigger: 'blur'}],
                gatewayIp: [{required: true, message: '请输入网关IP地址', trigger: 'blur'}],
            },
        }
    },
    created() {},
    methods: {
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    // 调用新增接口
                    axios.post('/api/gateway/add', this.form)
                        .then(response => {
                            this.$message.success("新增成功");
                            // 清空表单
                            this.resetForm();
                            // 跳转回网关分页
                            this.linkPage('gateway-list')
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