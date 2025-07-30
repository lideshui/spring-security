Vue.component('purchase-create', {
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
            <span style="color: #a1a0a0;">物料记录<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('purchase-list')">物料记录列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            添加物料记录
        </div>
        <el-row class="nav" :gutter="20">
          <el-col :span="24" class="nav-title">添加物料记录</el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--新增表单-->
        <el-form :model="form" ref="form" :rules="rules" label-width="120px">
            <div class="scrollable-area">
               <div class="card-attr">基本信息</div>
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="序号" prop="serialNumber">
                          <el-input type="number" v-model="form.serialNumber" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="系统号" prop="systemNumber">
                          <el-input v-model="form.systemNumber" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="物料编号" prop="materialCode">
                          <el-input v-model="form.materialCode" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="品名" prop="productName">
                          <el-input v-model="form.productName" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="英文名称" prop="englishName">
                          <el-input v-model="form.englishName" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="材质" prop="material">
                          <el-input v-model="form.material" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="规格" prop="specification">
                          <el-input v-model="form.specification" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="品牌" prop="brand">
                          <el-input v-model="form.brand" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="单位" prop="unit">
                          <el-input v-model="form.unit" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="数量" prop="brand">
                          <el-input v-model="form.quantity" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
                <el-row :gutter="20">
                   <el-col :span="6">
                      <el-form-item label="货号" prop="itemNumber">
                          <el-input v-model="form.itemNumber" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="6" :offset="1">
                      <el-form-item label="交货期" prop="deliveryDate">
                          <el-input v-model="form.deliveryDate" size="small" class="create-form-item"></el-input>
                      </el-form-item>
                   </el-col>
                </el-row> 
            </div>
            <div class="scrollable-area">
               <div class="card-attr">选择所属分析文件</div>
                  <el-form-item label="选择分析文件" style="margin-top: 10px">
                     <el-select v-model="form.analysisId"  class="search-item" filterable clearable size="small" placeholder="请选择分析文件">
                         <el-option
                                 v-for="item in analysisOptions"
                                 :key="item.id"
                                 :label="item.code"
                                 :value="item.id">
                         </el-option>
                     </el-select>
                     <el-tooltip class="item" effect="dark" content="设备模板：所有关联设备模板的设备都将基于此模板规则发送报文和解析响应。" placement="top">
                        <i style="color: #bfbfbf; font-size: 16px; line-height: 16px;" class="el-icon-question"></i>
                     </el-tooltip>
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
                analysisId: "",
                serialNumber: "",
                materialCode: "",
                productName: "",
                englishName: "",
                systemNumber: "",
                material: "",
                specification: "",
                brand: "",
                unit: "",
                quantity: "",
                itemNumber: "",
                deliveryDate: "",
            },
            rules: {
                serialNumber: [{required: true, message: '不可为空，请输入内容', trigger: 'blur'}],
                materialCode: [{required: true, message: '不可为空，请输入内容', trigger: 'blur'}],
            },
            analysisOptions: [],
        }
    },
    created() {
        this.getAnalysisOptions();
    },
    methods: {
        // 提交表单
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    // 调用新增接口
                    axios.post('/purchase/add', this.form)
                        .then(response => {
                            this.$message.success("新增成功");
                            // 清空表单
                            this.resetForm();
                            // 跳转回网关分页
                            this.linkPage('purchase-list')
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
        // 查询文件分析列表
        // 获取模板列表
        async getAnalysisOptions() {
            try {
                const response = await axios.get("/analysis/getAllList");
                this.analysisOptions = response.data.data;
            } catch (error) {
                console.error("获取列表异常:", error);
            }
        },
    }
})