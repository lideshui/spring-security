Vue.component('quartz-list', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component">
        <div class="title"><span style="color: #a1a0a0;">定时任务<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>任务列表</div>
        <el-row class="nav" :gutter="20">
          <el-col :span="3" class="nav-title">任务列表</el-col>
          <el-col :offset="12" :span="9" class="nav-right">
            <el-button size="mini" type="primary" @click="handleCreate">添加定时任务</el-button>
            <el-button size="mini" @click="handleBatchDelete">批量删除</el-button>
          </el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--搜索框-->
        <div class="search-container">
            <el-input v-model="quartz.jobName" class="search-item" clearable size="small" placeholder="请输入任务名称"></el-input>
            <el-select v-model="quartz.jobStatus"  class="search-item" filterable clearable size="small" placeholder="请选择任务状态">
                <el-option
                        v-for="item in quartzStatusOptions"
                        :key="item.prop"
                        :label="item.label"
                        :value="item.prop">
                </el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="clickQueryButton()">查询</el-button>
        </div>
        <el-divider style="margin: 0!important;"></el-divider>
        <!-- 表格部分 -->
        <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" v-loading="loading" style="width: 100%">
            <!-- 复选框 -->
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <!-- 状态列 -->
            <el-table-column
                label="任务状态"
                width="150">
                align="left">
                <template slot-scope="scope">
                    <span v-if="scope.row.jobStatus === 0" style="color: #13ce66"><i class="el-icon-message-solid"></i> 启用</span>
                    <span v-else-if="scope.row.jobStatus === 1" style="color: #cd6767"><i class="el-icon-message-solid"></i> 停用</span>
                    <span v-else style="color: #b3b5b4"><i class="el-icon-message-solid"></i> 无效状态</span>
                </template>
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
                width="220"
                align="left">
                <template slot-scope="scope">
                    <el-link v-if="scope.row.jobStatus != 0" class="link-container" type="primary" @click="openJob(scope.row)">启用</el-link>
                    <el-link v-else class="link-container" type="primary" @click="closeJob(scope.row)">停用</el-link>
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
            :current-page="quartz.pageNum"
            :page-sizes="[10, 20, 50]"
            :page-size="quartz.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="quartz.total">
        </el-pagination>
    </div>
    `,
    data() {
        return {
            quartz: {
                jobId: '',
                jobName: '',
                jobClass: '',
                jobMethod: '',
                cronExpression: '',
                concurrent: '',
                jobTrigger: '',
                jobStatus: '',
                jobGroup: '',
                jobTriggerGroup: '',
                // 分页参数
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
            tableColumns: [
                { prop: 'jobName', label: '任务名称' },
                { prop: 'jobClass', label: '任务全类名' },
                { prop: 'jobMethod', label: '任务方法名' },
                { prop: 'cronExpression', label: '执行策略' },
                { prop: 'jobGroup', label: '任务组' },
                { prop: 'jobTrigger', label: '触发器名称' },
                { prop: 'jobTriggerGroup', label: '触发器组' },
                { prop: 'createdTime', label: '创建时间' },
            ],
            quartzStatusOptions: [
                { prop: 0, label: '启用' },
                { prop: 1, label: '停用' },
            ],
            loading: true,
            multipleSelection: [],
            templateOptions: [],
        }
    },
    created() {
        // 初始化分页列表
        this.queryPageList()
    },
    methods: {
        // 分页查询
        async queryPageList() {
            try {
                const response = await axios.get("/api/quartz/getPageList", {
                    params: { ...this.quartz }
                })
                this.tableData = response.data.data.list.map(item => ({
                    ...item,
                }))
                this.quartz.total = response.data.data.total
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            } finally {
                this.loading = false
            }
        },
        // 点击查询按钮
        clickQueryButton(){
            this.quartz.pageNum = 1
            this.queryPageList()
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/quartz/delete', row)
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
                axios.post('/api/quartz/batchDelete', this.multipleSelection)
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
        // 开启定时任务
        openJob(row) {
            this.$confirm('此操作将启用此任务, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用开启接口
                axios.get('/api/quartz/openJob', {params: { jobId: row.jobId }})
                    .then(response => {
                        this.$message.success("成功启用任务");
                        // 刷新列表
                        this.queryPageList();
                    })
                    .catch(error => {
                        this.$message.error("启用任务失败: " + error.message);
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消启用'
                })
            })
        },
        // 关闭定时任务
        closeJob(row) {
            this.$confirm('此操作将停用此任务, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用开启接口
                axios.get('/api/quartz/closeJob', {params: { jobId: row.jobId }})
                    .then(response => {
                        this.$message.success("成功停用任务");
                        // 刷新列表
                        this.queryPageList();
                    })
                    .catch(error => {
                        this.$message.error("停用任务失败: " + error.message);
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消停用'
                })
            })
        },
        // 分页插件事件
        handleCurrentChange(val) {
            this.quartz.pageNum = val
            this.queryPageList()
        },
        // 分页插件事件
        handleSizeChange(val) {
            this.quartz.pageSize = val
            this.quartz.pageNum = 1
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
                component: 'quartz-edit',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 查看模板
        handleShow(row) {
            let paramObj = {
                component: 'quartz-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 新增模板
        handleCreate() {
            let paramObj = {
                component: 'quartz-create',
                data: {}
            }
            this.$emit('change-component', paramObj);
        },
    }
})