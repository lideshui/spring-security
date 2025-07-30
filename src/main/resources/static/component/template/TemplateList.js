Vue.component('template-list', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component">
        <div class="title"><span style="color: #a1a0a0;">模板管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>模板列表</div>
        <el-row class="nav" :gutter="20">
          <el-col :span="3" class="nav-title">模板列表</el-col>
          <el-col :offset="12" :span="9" class="nav-right">
            <el-button size="mini" type="primary" @click="handleCreate">添加设备模板</el-button>
            <el-button size="mini" @click="handleBatchDelete">批量删除</el-button>
          </el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--搜索框-->
        <div class="search-container">
            <el-input v-model="template.templateName" class="search-item" clearable size="small" placeholder="请输入模板名称"></el-input>
            <el-input v-model="template.templateCode" class="search-item" clearable size="small" placeholder="请输入模板编码"></el-input> 
            <el-input v-model="template.pollingMethod" class="search-item" clearable size="small" placeholder="请输入轮询方法"></el-input> 
            <el-input v-model="template.communicationProtocol" class="search-item" clearable size="small" placeholder="请输入通信协议"></el-input> 
            <el-button size="mini" type="primary" @click="queryPageList()">查询</el-button>
        </div>
        <el-divider style="margin: 0!important;"></el-divider>
        <!-- 表格部分 -->
        <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" v-loading="loading" style="width: 100%">
            <!-- 复选框 -->
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <!-- 动态渲染 -->
            <el-table-column 
                v-for="column in tableColumns" 
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
            />
            <!-- 操作列 -->
            <el-table-column
                label="操作"
                width="180"
                align="left">
                <template slot-scope="scope">
                    <el-link class="link-container" type="primary" @click="handleShow(scope.row)">查看</el-link>
                    <el-link class="link-container" type="primary" @click="handleEdit(scope.row)">修改</el-link>
                    <el-link class="link-container" type="primary" @click="handleDelete(scope.row)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加分页组件 -->
        <el-pagination
            class="pagination-container"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="template.pageNum"
            :page-sizes="[10, 20, 50]"
            :page-size="template.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="template.total">
        </el-pagination>
    </div>
    `,
    data() {
        return {
            template: {
                templateId: '',
                templateName: '',
                templateCode: '',
                pollingMethod: '',
                communicationProtocol: '',
                // 分页参数
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
            tableColumns: [
                { prop: 'templateName', label: '模板名称' },
                { prop: 'templateCode', label: '模板编码' },
                { prop: 'pollingMethod', label: '轮询方法' },
                { prop: 'communicationProtocol', label: '通信协议' },
                { prop: 'createdTime', label: '创建时间' },
            ],
            loading: true,
            multipleSelection: [],
            gatewayOptions: [],
            templateOptions: [],
        }
    },
    created() {
        // 初始化分页列表
        this.queryPageList()
        // 获取网关下拉框
        this.getGatewayOptions()
        // 获取模板下拉框
        this.getTemplateOptions()
    },
    methods: {
        // 分页查询
        async queryPageList() {
            try {
                const response = await axios.get("/api/template/getPageList", {
                    params: { ...this.template }
                })
                this.tableData = response.data.data.list.map(item => ({
                    ...item,
                }))
                this.template.total = response.data.data.total
            } catch (error) {
                console.error("获取分页列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            } finally {
                this.loading = false
            }
        },
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
        // 删除操作
        handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/template/delete', row)
                    .then(response => {
                        this.$message.success("删除成功");
                        this.multipleSelection = []
                        // 刷新列表
                        this.queryPageList();
                    })
                    .catch(error => {
                        this.$message.error("删除失败: " + error.message);
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        // 批量删除操作
        handleBatchDelete() {
            if(this.multipleSelection.length < 1 ){
                this.$message.warning("请至少选择一条需要删除的数据");
                return;
            }
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/template/batchDelete', this.multipleSelection)
                    .then(response => {
                        this.$message.success("批量删除成功");
                        // 刷新列表
                        this.queryPageList();
                    })
                    .catch(error => {
                        this.$message.error("批量删除失败: " + error.message);
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            }).finally(() => {
                this.multipleSelection = []
            })
        },
        // 分页插件事件
        handleCurrentChange(val) {
            this.template.pageNum = val
            this.queryPageList()
        },
        // 分页插件事件
        handleSizeChange(val) {
            this.template.pageSize = val
            this.template.pageNum = 1
            this.queryPageList()
        },
        // 表格多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        // 修改模板
        handleEdit(row) {
            let paramObj = {
                component: 'template-edit',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 查看模板
        handleShow(row) {
            let paramObj = {
                component: 'template-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 新增模板
        handleCreate() {
            let paramObj = {
                component: 'template-create',
                data: {}
            }
            this.$emit('change-component', paramObj);
        },
    }
})