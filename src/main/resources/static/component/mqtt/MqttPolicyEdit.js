Vue.component('mqtt-policy-edit', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component mqtt-create">
        <div class="title">
            <span style="color: #a1a0a0;">消息队列<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('mqtt-policy-list')">MQTT推送策略<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            修改推送策略
        </div>
        <el-row class="nav" :gutter="20">
          <el-col :span="24" class="nav-title">修改推送策略</el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--修改表单-->
        <el-form :model="form" ref="form" :rules="rules" label-width="120px">
            <div class="scrollable-area">
               <div class="card-attr">基本信息</div>
               <el-row :gutter="20" class="card-attr-row" style="margin-top: 10px">
                  <el-col :span="6">
                     <el-form-item label="策略名称" prop="policyName">
                         <el-input v-model="form.policyName" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6">
                     <el-form-item label="推送Topic" prop="topic">
                         <el-input v-model="form.topic" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="推送状态" prop="policyStatus">
                         <el-select v-model="form.policyStatus" class="create-form-item" filterable clearable size="small" placeholder="请选择任务状态">
                             <el-option
                                     v-for="item in policyStatusOptions"
                                     :key="item.prop"
                                     :label="item.label"
                                     :value="item.prop">
                             </el-option>
                         </el-select>
                     </el-form-item>
                  </el-col>
               </el-row>
            </div>
            <div class="scrollable-area">
               <div class="card-attr">策略模板</div>
                  <el-input
                    type="textarea"
                    placeholder="请输入策略模板"
                    v-model="form.policyTemplate"
                    clearable
                    :autosize="{ minRows: 5, maxRows: 10}"
                    style="margin: 20px 0; border-radius: 0!important;"
                  ></el-input>
            </div>
            <div class="scrollable-area">
               <div class="card-attr">关联网关</div>
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="关联网关" prop="gatewayNameChecked">
                        <el-input v-model="gatewayNameChecked" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6">
                     <el-button type="primary" size="small" plain @click="dialogGatewayVariable = true" style="margin-top: 5px">批量选择关联网关</el-button>
                  </el-col>
               </el-row> 
            </div>
            <div class="scrollable-area">
               <div class="card-attr">执行策略</div>
               <el-row :gutter="20" class="card-attr-row" style="margin-top: 10px">
                  <el-col :span="6">
                     <el-form-item label="cron表达式" prop="cronExpression">
                         <el-input v-model="form.cronExpression" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6">
                     <el-button type="primary" size="small" plain @click="dialogCronVariable = true" style="margin-top: 5px">生成Cron表达式</el-button>
                  </el-col>
               </el-row> 
            </div>
            <div style="width: 50%">
                <el-form-item style="text-align: center; margin-top: 30px">
                    <el-button type="primary" @click="submitForm">立即保存</el-button>
                </el-form-item>
            </div>
        </el-form>
        <!-- 穿梭框 -->
        <el-dialog title="选择关联网关" :visible.sync="dialogGatewayVariable" width="40%" style="min-width: 620px">
            <el-transfer
               filterable
               :filter-method="filterGateway"
               filter-placeholder="请输入网关名称"
               :titles="['未选网关', '已选网关']"
               :button-texts="['删除', '添加']"
               v-model="gatewayChecked"
               :data="gatewayOptions"
               :props="{key: 'gatewayId', label: 'gatewayName'}">
            </el-transfer>
        </el-dialog>
        <!-- cron表达式生成器 -->
        <el-dialog title="🕒 Cron表达式生成器" :visible.sync="dialogCronVariable" width="40%" style="min-width: 620px">
            <quartz-cron-generator @change-component="getQuartzCron"></quartz-cron-generator>
        </el-dialog>
    </div>
    `,
    data() {
        return {
            form: {
                mqttPolicyId: this.data.mqttPolicyId,
                policyName: this.data.policyName,
                policyTemplate: this.data.policyTemplate,
                policyStatus: this.data.policyStatus,
                topic: this.data.topic,
                cronExpression: this.data.cronExpression,
                gatewayList: this.data.gatewayList,
            },
            rules: {
                policyName: [{required: true, message: '请输入内容', trigger: 'blur'}],
                policyTemplate: [{required: true, message: '请输入内容', trigger: 'blur'}],
                policyStatus: [{required: true, message: '请输入内容', trigger: 'blur'}],
                topic: [{required: true, message: '请输入内容', trigger: 'blur'}],
                cronExpression: [{required: true, message: '请输入内容', trigger: 'blur'}],
            },
            dialogCronVariable: false,
            dialogGatewayVariable: false,
            policyStatusOptions: [
                { prop: 0, label: '开启' },
                { prop: 1, label: '关闭' },
            ],
            gatewayOptions: [],
            gatewayChecked: this.data.gatewayList.map(item => item.gatewayId) || [],
            gatewayNameChecked: [],
            filterGateway(query, item) {
                return item.gatewayName.includes(query.toLowerCase())
            },
        }
    },
    created() {
        // 获取网关下拉框
        this.getGatewayOptions()
    },
    watch: {
        // 监听 gatewayList 的变化
        'gatewayChecked': {
            handler(newValue) {
                this.updateGatewayChecked(newValue)
            },
            immediate: true, // 立即执行一次初始化
            deep: true       // 深度监听数组变化
        }
    },
    methods: {
        // 获取网关列表
        async getGatewayOptions() {
            try {
                const response = await axios.get("/api/gateway/getAllList");
                this.gatewayOptions = response.data.data;
                // 数据加载后，初始化 gatewayChecked
                this.gatewayChecked = this.data.gatewayList.map(item => item.gatewayId) || [];
            } catch (error) {
                console.error("获取列表异常:", error);
            }
        },
        // 修改更新网关名称的方法
        updateGatewayChecked(selectedIds) {
            this.gatewayChecked = selectedIds;
            const selected = this.gatewayOptions.filter(item => selectedIds.includes(item.gatewayId))
            this.form.gatewayList = selected
            this.gatewayNameChecked = selected.map(item => item.gatewayName).join(', ')
        },
        // 提交表单
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    // 调用修改接口
                    axios.post('/api/mqttPolicy/edit', this.form)
                        .then(response => {
                            if(!response.data.ok){
                                this.$message.error("修改失败: " + response.data.data);
                                return
                            }
                            this.$message.success("修改成功");
                            // 跳转回网关分页
                            this.linkPage('mqtt-policy-list')
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
        // cron子组件传参
        getQuartzCron(paramData) {
            this.dialogCronVariable = false
            this.form.cronExpression = paramData
        },

    }
})