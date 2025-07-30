Vue.component('material-create', {
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
            <span style="color: #a1a0a0;">物料信息<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('material-list')">物料信息列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            添加物料
        </div>
        <el-row class="nav" :gutter="20">
          <el-col :span="24" class="nav-title">添加物料</el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--新增表单-->
        <el-form :model="form" ref="form" :rules="rules" label-width="120px">
            <div class="scrollable-area">
               <div class="card-attr">基本信息</div>
               <el-row :gutter="20" class="card-attr-row" style="margin-top: 10px">
                  <el-col :span="8">
                     <el-form-item label="物料编号" prop="number">
                         <el-input v-model="form.number" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
               <el-row :gutter="20" class="card-attr-row" style="margin-top: 10px">
                  <el-col :span="8">
                     <el-form-item label="物料描述" prop="description">
                         <el-input v-model="form.description" size="small" class="create-form-item"></el-input>
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
                number: '',
                description: '',
            },
            rules: {
                number: [{required: true, message: '请输入物料编号', trigger: 'blur'}],
                description: [{required: true, message: '请输入物料描述', trigger: 'blur'}],
            },
        }
    },
    created() {
    },
    methods: {
        // 提交表单
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    // 调用新增接口
                    axios.post('/material/add', this.form)
                        .then(response => {
                            this.$message.success("新增成功");
                            // 清空表单
                            this.resetForm();
                            // 跳转回网关分页
                            this.linkPage('material-list')
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