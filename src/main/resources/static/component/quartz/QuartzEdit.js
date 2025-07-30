Vue.component('quartz-edit', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component quartz-create">
        <div class="title">
            <span style="color: #a1a0a0;">任务管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('quartz-list')">任务列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            修改任务
        </div>
        <el-row class="nav" :gutter="20">
          <el-col :span="24" class="nav-title">修改任务</el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--表单-->
        <el-form :model="form" ref="form" :rules="rules" label-width="120px">
            <div class="scrollable-area">
               <div class="card-attr">基本信息</div>
               <el-row :gutter="20" class="card-attr-row" style="margin-top: 10px">
                  <el-col :span="6">
                     <el-form-item label="任务名称" prop="jobName">
                         <el-input v-model="form.jobName" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="任务状态" prop="jobStatus">
                         <el-select v-model="form.jobStatus" class="create-form-item" filterable clearable size="small" placeholder="请选择任务状态">
                             <el-option
                                     v-for="item in quartzStatusOptions"
                                     :key="item.prop"
                                     :label="item.label"
                                     :value="item.prop">
                             </el-option>
                         </el-select>
                     </el-form-item>
                  </el-col>
               </el-row> 
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="任务全类名" prop="jobClass">
                         <el-input v-model="form.jobClass" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="任务方法名" prop="jobMethod">
                         <el-input v-model="form.jobMethod" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="并发执行" prop="concurrent">
                         <el-select v-model="form.concurrent"  class="create-form-item" filterable clearable size="small" placeholder="请选择任务状态">
                             <el-option
                                     v-for="item in quartzConcurrentOptions"
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
               <div class="card-attr">任务标识</div>
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="触发器组" prop="jobTriggerGroup">
                         <el-input v-model="form.jobTriggerGroup" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                     <el-form-item label="触发器" prop="jobTrigger">
                         <el-input v-model="form.jobTrigger" size="small" class="create-form-item" disabled></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
               <el-row :gutter="20" class="card-attr-row">
                  <el-col :span="6">
                     <el-form-item label="任务组" prop="jobGroup">
                         <el-input v-model="form.jobGroup" size="small" class="create-form-item"></el-input>
                     </el-form-item>
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
        <!-- cron表达式生成器 -->
        <el-dialog title="🕒 Cron表达式生成器" :visible.sync="dialogCronVariable" width="40%" style="min-width: 620px">
            <quartz-cron-generator @change-component="getQuartzCron"></quartz-cron-generator>
        </el-dialog>
    </div>
    `,
    data() {
        return {
            form: {
                jobId: this.data.jobId,
                jobName: this.data.jobName,
                jobClass: this.data.jobClass,
                jobMethod: this.data.jobMethod,
                jobTrigger: this.data.jobTrigger,
                cronExpression: this.data.cronExpression,
                jobStatus: this.data.jobStatus,
                concurrent: this.data.concurrent,
                jobGroup: this.data.jobGroup,
                jobTriggerGroup: this.data.jobTriggerGroup,
            },
            rules: {
                jobName: [{required: true, message: '请输入内容', trigger: 'blur'}],
                jobClass: [{required: true, message: '请输入内容', trigger: 'blur'}],
                jobMethod: [{required: true, message: '请输入内容', trigger: 'blur'}],
                cronExpression: [{required: true, message: '请输入内容', trigger: 'blur'}],
                concurrent: [{required: true, message: '请输入内容', trigger: 'blur'}],
                jobTrigger: [{required: true, message: '请输入内容', trigger: 'blur'}],
                jobStatus: [{required: true, message: '请输入内容', trigger: 'blur'}],
                jobGroup: [{required: true, message: '请输入内容', trigger: 'blur'}],
                jobTriggerGroup: [{required: true, message: '请输入内容', trigger: 'blur'}],
            },
            dialogCronVariable: false,
            quartzStatusOptions: [
                { prop: 0, label: '启用' },
                { prop: 1, label: '停用' },
            ],
            quartzConcurrentOptions: [
                { prop: 0, label: '开启多线程' },
                { prop: 1, label: '关闭多线程' },
            ],
        }
    },
    created() {},
    watch: {
        // 监听 form.jobMethod 的变化
        'form.jobMethod': {
            handler(newValue) {
                this.form.jobTrigger = 'trigger_' + newValue;
            },
        }
    },
    methods: {
        // 提交表单
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    // 调用新增接口
                    axios.post('/api/quartz/edit', this.form)
                        .then(response => {
                            if(!response.data.ok){
                                this.$message.error("修改失败: " + response.data.data);
                                return
                            }
                            this.$message.success("修改成功");
                            // 跳转回网关分页
                            this.linkPage('quartz-list')
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