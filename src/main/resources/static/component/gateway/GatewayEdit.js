Vue.component('gateway-edit', {
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
            修改网关
        </div>
        <el-row class="nav" :gutter="20">
          <el-col :span="24" class="nav-title">修改网关</el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <div class="scrollable-area" style="margin-top: 15px">
            <div class="card-attr">基本信息</div>
                <el-tag style="margin-bottom: 10px" type="warning">
                   <i style="font-size: 16px; line-height: 16px; padding-right: 5px" class="el-icon-warning"></i>
                   可通过修改网关状态停止对该网关的数据采集，对于停用状态的网关，想再次启用，将其修改为在线即可！
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
                    <el-button type="primary" @click="submitForm">保存修改</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
<!--    <div class="component gateway-create">-->
<!--        <div class="title">-->
<!--            <span style="color: #a1a0a0;">网关管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>-->
<!--            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('gateway-list')">网关列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>-->
<!--            修改网关-->
<!--        </div>-->
<!--        <el-row class="nav" :gutter="20">-->
<!--          <el-col :span="24" class="nav-title">修改网关</el-col>-->
<!--        </el-row> -->
<!--        <el-divider style="margin: 0!important;"></el-divider>-->
<!--        <el-tag style="margin-top: 10px" type="warning">-->
<!--            <i style="font-size: 16px; line-height: 16px; padding-right: 5px" class="el-icon-warning"></i>-->
<!--            可通过修改网关状态停止对该网关的数据采集，对于停用状态的网关，想再次启用，将其修改为在线即可！-->
<!--        </el-tag>-->
<!--        <div class="from-container">-->
<!--           <el-form ref="form" :model="form" label-width="120px" :rules="rules">-->
<!--              <el-row :gutter="20">-->
<!--                 <el-col :span="6">-->
<!--                    <el-form-item label="网关名称" prop="gatewayName" class="must-fill-form">-->
<!--                        <el-input v-model="form.gatewayName" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--                 <el-col :span="6" :offset="1">-->
<!--                    <el-form-item label="网关编码" prop="gatewayCode" class="must-fill-form">-->
<!--                        <el-input v-model="form.gatewayCode" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--              </el-row> -->
<!--              <el-row :gutter="20">-->
<!--                 <el-col :span="6">-->
<!--                    <el-form-item label="IP地址" prop="gatewayIp" class="must-fill-form">-->
<!--                        <el-input v-model="form.gatewayIp" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--                 <el-col :span="6" :offset="1">-->
<!--                    <el-form-item label="通信端口" prop="gatewayPort">-->
<!--                        <el-input v-model="form.gatewayPort" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--              </el-row> -->
<!--              <el-row :gutter="20">-->
<!--                 <el-col :span="6">-->
<!--                    <el-form-item label="心跳包" prop="heartbeat">-->
<!--                        <el-input v-model="form.heartbeat" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--                 <el-col :span="6" :offset="1">-->
<!--                    <el-form-item label="SN码" prop="gatewaySn">-->
<!--                        <el-input v-model="form.gatewaySn" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--              </el-row> -->
<!--              <el-row :gutter="20">-->
<!--                 <el-col :span="6">-->
<!--                    <el-form-item label="MAC地址" prop="gatewayMac">-->
<!--                        <el-input v-model="form.gatewayMac" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--                 <el-col :span="6" :offset="1">-->
<!--                    <el-form-item label="IMEI号" prop="gatewayImei">-->
<!--                        <el-input v-model="form.gatewayImei" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--              </el-row> -->
<!--              <el-row :gutter="20">-->
<!--                 <el-col :span="6">-->
<!--                    <el-form-item label="安装位置" prop="installationLocation">-->
<!--                        <el-input v-model="form.installationLocation" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--                 <el-col :span="6" :offset="1">-->
<!--                    <el-form-item label="网关坐标" prop="gatewayCoordinates">-->
<!--                        <el-input v-model="form.gatewayCoordinates" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--              </el-row> -->
<!--              <el-row :gutter="20">-->
<!--                 <el-col :span="6">-->
<!--                    <el-form-item label="网关标签" prop="gatewayTag">-->
<!--                        <el-input v-model="form.gatewayTag" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--                 <el-col :span="6" :offset="1">-->
<!--                    <el-form-item label="网关类型" prop="gatewayType">-->
<!--                        <el-input v-model="form.gatewayType" size="small" class="create-form-item"></el-input>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--              </el-row> -->
<!--              <el-row :gutter="20">-->
<!--                 <el-col :span="6">-->
<!--                    <el-form-item label="网关状态">-->
<!--                        <el-select v-model="form.gatewayStatus" size="small" class="create-form-item">-->
<!--                            <el-option-->
<!--                                    v-for="item in gatewayStatusOptions"-->
<!--                                    :key="item.prop"-->
<!--                                    :label="item.label"-->
<!--                                    :value="item.prop"-->
<!--                                    :disabled="item.disabled">-->
<!--                            </el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--              </el-row> -->

<!--              <el-row :gutter="20">-->
<!--                 <el-col :span="13">-->
<!--                    <el-form-item style="text-align: right; margin-top: 30px">-->
<!--                        <el-button type="primary" @click="submitForm">保存修改</el-button>-->
<!--                    </el-form-item>-->
<!--                 </el-col>-->
<!--              </el-row> -->
<!--           </el-form>-->
<!--        </div>-->
<!--    </div>-->
    `,
    data() {
        return {
            form: {
                gatewayId: this.data.gatewayId,
                gatewayName: this.data.gatewayName,
                gatewayCode: this.data.gatewayCode,
                gatewayIp: this.data.gatewayIp,
                gatewayPort: this.data.gatewayPort,
                gatewaySn: this.data.gatewaySn,
                heartbeat: this.data.heartbeat,
                gatewayStatus: this.data.gatewayStatus,
                gatewayMac: this.data.gatewayMac,
                gatewayImei: this.data.gatewayImei,
                gatewayTag: this.data.gatewayTag,
                gatewayType: this.data.gatewayType,
                gatewayCoordinates: this.data.gatewayCoordinates,
                installationLocation: this.data.installationLocation,
            },
            rules: {
                gatewayName: [{required: true, message: '请输入网关名称', trigger: 'blur'}],
                gatewayCode: [{required: true, message: '请输入网关编码', trigger: 'blur'}],
                gatewayIp: [{required: true, message: '请输入网关IP地址', trigger: 'blur'}],
            },
            gatewayStatusOptions: [
                { prop: 0, label: '在线', disabled: false },
                { prop: 1, label: '离线', disabled: true },
                { prop: 2, label: '停用', disabled: false },
            ]
        }
    },
    created() {},
    methods: {
        // 提交修改
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    // 调用修改接口
                    axios.post('/api/gateway/edit', this.form)
                        .then(response => {
                            this.$message.success("修改成功");
                            // 跳转回网关分页
                            this.linkPage('gateway-list')
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