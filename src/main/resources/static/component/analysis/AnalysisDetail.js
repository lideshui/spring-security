Vue.component('analysis-detail', {
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
            <span style="color: #a1a0a0;">解析管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('analysis-list')">文件解析列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            修改物料信息
            <div style="float: right;">
                <el-button type="primary" size="small" plain @click="handleDownload()" style="margin-top: 5px">下载当前Excel文件</el-button>
                <el-button type="primary" size="small" @click="linkPage('analysis-list')" style="margin-top: 5px">返回文件解析列表</el-button>
            </div>
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="物料记录" name="first">
                    <div class="table-area scroll-controller">
                        <!-- 报文表格 -->
                        <el-table :data="purchaseList" style="width: 100%" v-if="this.purchaseList.length > 0">
                            <!-- 解析状态 -->
                            <el-table-column
                                label="解析状态"
                                width="120">
                                align="left">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.status === 0" style="color: #a19e9e"><i class="el-icon-s-tools"></i> 未解析</span>
                                    <span v-else-if="scope.row.status === 1" style="color: #13ce66"><i class="el-icon-s-tools"></i> 已解析</span>
                                    <span v-else style="color: #faab0f"><i class="el-icon-s-tools"></i> 无匹配结果</span>
                                </template>
                            </el-table-column>
                            <!-- 处理状态 -->
                            <el-table-column
                                label="人工处理"
                                width="100">
                                align="left">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.materialCode == ''" style="color: #ec3434"><i class="el-icon-s-tools"></i> 未处理</span>
                                    <span v-else-if="scope.row.status != 2" style="color: #13ce66"><i class="el-icon-s-tools"></i> 无需处理</span>
                                    <span v-else style="color: #13ce66"><i class="el-icon-s-tools"></i> 已处理</span>
                                </template>
                            </el-table-column>
                            <!-- 序号 -->
                            <el-table-column
                                label="序号"
                                align="left"
                                width="100">
                                <template slot-scope="scope">
                                    <span>{{scope.row.serialNumber}}</span>
                                </template>
                            </el-table-column>
                            <!-- 品牌 -->
                            <el-table-column
                                label="品牌"
                                align="left"
                                width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.brand}}</span>
                                </template>
                            </el-table-column>
                            <!-- 品名 -->
                            <el-table-column
                                label="品名"
                                align="left"
                                width="200">
                                <template slot-scope="scope">
                                    <span>{{scope.row.productName}}</span>
                                </template>
                            </el-table-column>
                            <!-- 材质 -->
                            <el-table-column
                                label="材质"
                                align="left"
                                width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.material}}</span>
                                </template>
                            </el-table-column>
                            <!-- 规格 -->
                            <el-table-column
                                label="规格"
                                align="left"
                                width="300">
                                <template slot-scope="scope">
                                    <span>{{scope.row.specification}}</span>
                                </template>
                            </el-table-column>
                            <!-- 物料编号 -->
                            <el-table-column
                                label="物料编号"
                                align="left">
                                <template slot-scope="scope">
                                    <el-tooltip :content="scope.row.description"  placement="top" :disabled="!scope.row.description" >
                                        <span style="color: #67C23A">{{ scope.row.materialCode }}</span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <!-- 创建时间 -->
                            <el-table-column
                                label="创建时间"
                                align="left">
                                <template slot-scope="scope">
                                    <span>{{scope.row.createTime}}</span>
                                </template>
                            </el-table-column>
                            <!-- 操作列 -->
                            <el-table-column
                                label="操作"
                                width="240"
                                align="left">
                                <template slot-scope="scope">
                                    <el-link class="link-container" type="primary" @click="openEditPurchase(scope.row)">修改物料编号</el-link>
                                    <el-link class="link-container" type="primary" @click="searchCode(scope.row)">检索物料编号</el-link>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-empty description="该文件解析任务下暂无物料记录数据" v-else></el-empty>
                    </div>
                </el-tab-pane>
                <!--第二个tag页-->
                <el-tab-pane label="物料信息库" name="second">
                    <!--搜索框-->
                    <div class="search-container">
                        <el-input v-model="material.number" class="search-item" clearable size="small" placeholder="请输入物料编码"></el-input>
                        <el-input v-model="material.descriptionFilter1" class="search-item" clearable size="small" placeholder="物料描述过滤项1"></el-input>
                        <el-input v-model="material.descriptionFilter2" class="search-item" clearable size="small" placeholder="物料描述过滤项2"></el-input>
                        <el-input v-model="material.descriptionFilter3" class="search-item" clearable size="small" placeholder="物料描述过滤项3"></el-input>
                        <el-button size="mini" type="primary" @click="clickQueryButton()">查询</el-button>
                    </div>
                    <el-divider style="margin: 0!important;"></el-divider>
                    <!-- 表格部分 -->
                    <el-table ref="multipleTable" :data="materialList" v-loading="loading" style="width: 100%">
                        <!-- 动态渲染 -->
                        <el-table-column 
                            v-for="column in materialColumns" 
                            :key="column.prop"
                            :prop="column.prop"
                            :label="column.label"
                            show-overflow-tooltip/>
                        </el-table-column>
                    </el-table>
                    <!-- 添加分页组件 -->
                    <el-pagination
                        class="pagination-container"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        :current-page="material.pageNum"
                        :page-sizes="[10, 20, 50]"
                        :page-size="material.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="material.total">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </template>
        <!-- 修改物料编号 -->
        <el-dialog title="修改物料编号" :visible.sync="dialogEditPurchase" width="30%">
            <el-form :model="purchaseFrom" ref="purchaseFrom" :rules="purchaseFromRules" @submit.native.prevent="editPurchase" label-width="80px">
                <!-- 使用栅格布局实现一行两列 -->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="物料编号" prop="materialCode">
                            <el-input v-model="purchaseFrom.materialCode" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 按钮容器 -->
                <div class="dialog-footer">
                    <el-button @click="dialogEditPurchase = false" size="small">取 消</el-button>
                    <el-button type="primary" native-type="submit" size="small">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
    `,
    data() {
        return {
            activeName: 'first',
            material: {
                id: '',
                number: '',
                descriptionFilter1: '',
                descriptionFilter2: '',
                descriptionFilter3: '',
                createTime: '',
                updateTime: '',
                // 分页参数
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            materialList: [],
            materialColumns: [
                { prop: 'number', label: '物料编码' },
                { prop: 'description', label: '物料描述' },
                { prop: 'createTime', label: '创建时间' },
                { prop: 'updateTime', label: '修改时间' }
            ],
            purchaseList: [],
            loading: true,
            dialogEditPurchase: false,
            purchaseFrom:{
                id: "",
                materialCode: "",
            },
            purchaseFromRules: {
                materialCode: [{required: true, message: '请输入物料编号', trigger: 'blur'}],
            },
        }
    },
    created() {
        // 查询物料记录
        this.queryPurchasePageList();
        // 查询物料信息
        this.queryMaterialPageList();
    },
    methods: {
        // 标签切换
        handleClick(tab) {},
        // 跳转页面
        linkPage(component) {
            let paramObj = {
                component: component,
                data: {}
            }
            this.$emit('change-component', paramObj);
        },
        // 查询物料记录
        async queryPurchasePageList() {
            try {
                const response = await axios.get("/purchase/getPageList", {
                    params: {code: this.data.code, pageNum: 1, pageSize: 99999}
                })
                this.purchaseList = response.data.data.records
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            }
        },
        // 查询物料信息
        async queryMaterialPageList() {
            try {
                const response = await axios.get("/material/getPageList", {
                    params: { ...this.material }
                })
                console.log(response.data.data.records)
                this.materialList = response.data.data.records
                this.material.total = response.data.data.total
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            } finally {
                this.loading = false
            }
        },
        // 检索物料编号
        searchCode(row){
            this.activeName = "second"
            if(row.brand !== "Local" && row.brand !== "local"){
                this.material.descriptionFilter1 = row.brand + row.productName;
            }else {
                this.material.descriptionFilter1 = row.productName;
            }
            this.material.descriptionFilter2 = row.material
            this.material.descriptionFilter3 = row.specification
            this.queryMaterialPageList()
        },
        // 点击查询按钮
        clickQueryButton(){
            this.material.pageNum = 1
            this.queryMaterialPageList()
        },
        // 打开修改物料编号弹窗
        openEditPurchase(row) {
            this.dialogEditPurchase = true;
            this.purchaseFrom.id = row.id;
            this.purchaseFrom.materialCode = row.materialCode;
        },
        // 修改物料编号
        editPurchase() {
            this.$refs['purchaseFrom'].validate((valid) => {
                if (valid) {
                    // 调用修改接口
                    axios.post('/purchase/edit', this.purchaseFrom)
                        .then(response => {
                            this.$message.success("修改成功");
                            // 关闭弹窗
                            this.dialogEditPurchase = false;
                            // 刷新报文列表
                            this.queryPurchasePageList();
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
        // 分页插件事件
        handleCurrentChange(val) {
            this.material.pageNum = val
            this.queryPurchasePageList()
        },
        // 分页插件事件
        handleSizeChange(val) {
            this.material.pageSize = val
            this.material.pageNum = 1
            this.queryPurchasePageList()
        },
        // 下载
        handleDownload(){
            axios.get(`/analysis/export?analysisId=${this.data.id}`, {
                responseType: 'blob'
            }).then(res => {
                const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = `${this.data.fileName}.xlsx`
                link.click()
            })
        },
    }
})