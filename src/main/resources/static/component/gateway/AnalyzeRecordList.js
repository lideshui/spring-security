Vue.component('analyze-record-list', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component">
        <div class="title"><span style="color: #a1a0a0;">网关管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>解析记录</div>
        <el-row class="nav" :gutter="20">
          <el-col :span="3" class="nav-title">解析记录</el-col>
          <el-col :offset="12" :span="9" class="nav-right">
            <el-button size="mini" @click="handleBatchDelete">批量删除</el-button>
          </el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--搜索框-->
        <div class="search-container">
            <el-select v-model="analyzeRecord.analyzeStatus" class="search-item" filterable clearable size="small" placeholder="请选择解析状态">
                <el-option
                        v-for="item in analyzeStatusOptions"
                        :key="item.prop"
                        :label="item.label"
                        :value="item.prop">
                </el-option>
            </el-select>
            <el-select v-model="analyzeRecord.gatewayIp"  class="search-item" filterable clearable size="small" placeholder="请选择网关">
                <el-option
                        v-for="item in gatewayOptions"
                        :key="item.gatewayIp"
                        :label="item.gatewayName"
                        :value="item.gatewayIp">
                </el-option>
            </el-select>
            <el-select v-model="analyzeRecord.templateName"  class="search-item" filterable clearable size="small" placeholder="请选择模板" @change="changeTemplate">
                <el-option
                        v-for="item in templateOptions"
                        :key="item.templateName"
                        :label="item.templateName"
                        :value="item.templateName">
                </el-option>
            </el-select>
            <el-select v-model="analyzeRecord.messageName"  class="search-item" filterable clearable size="small" placeholder="请选择报文">
                <el-option
                        v-for="item in messageOptions"
                        :key="item.messageName"
                        :label="item.messageName"
                        :value="item.messageName">
                </el-option>
            </el-select>
            <el-input v-model="analyzeRecord.requestMessage" class="search-item" clearable size="small" placeholder="请输入请求报文"></el-input>
            <el-input v-model="analyzeRecord.responseMessage" class="search-item" clearable size="small" placeholder="请输入响应报文"></el-input> 
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
            <!-- 状态列 -->
            <el-table-column
                label="解析状态"
                width="100"
                align="left">
                <template slot-scope="scope">
                    <span v-if="scope.row.analyzeStatus === 0" style="color: #13ce66"><i class="el-icon-s-tools"></i> 成功</span>
                    <span v-else-if="scope.row.analyzeStatus === 1" style="color: #cd6767"><i class="el-icon-s-tools"></i> 失败</span>
                    <span v-else-if="scope.row.analyzeStatus === 2" style="color: #f1a633"><i class="el-icon-s-tools"></i> 异常</span>
                    <span v-else style="color: #b3b5b4"><i class="el-icon-s-tools"></i> 无效状态</span>
                </template>
            </el-table-column>
            <!-- 动态渲染 -->
            <el-table-column 
                v-for="column in tableColumns" 
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                show-overflow-tooltip
            />
            <!-- 操作列 -->
            <el-table-column
                label="操作"
                width="120"
                align="left">
                <template slot-scope="scope">
                    <el-link class="link-container" type="primary" @click="handleShow(scope.row)">查看</el-link>
                    <el-link class="link-container" type="primary" @click="handleDelete(scope.row)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加分页组件 -->
        <el-pagination
            class="pagination-container"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="analyzeRecord.pageNum"
            :page-sizes="[10, 20, 50]"
            :page-size="analyzeRecord.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="analyzeRecord.total">
        </el-pagination>
    </div>
    `,
    data() {
        return {
            analyzeRecord: {
                analyzeRecordId: '',
                requestMessage: '',
                responseMessage: '',
                gatewayName: '',
                gatewayIp: '',
                deviceName: '',
                deviceCode: '',
                templateName: '',
                messageName: '',
                analyzeResult: '',
                analyzeStatus: '',
                exceptionInfo: '',
                // 分页参数
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
            tableColumns: [
                { prop: 'gatewayName', label: '网关名称' },
                { prop: 'gatewayIp', label: '网关IP' },
                { prop: 'deviceName', label: '设备名称' },
                { prop: 'deviceCode', label: '设备编码' },
                { prop: 'templateName', label: '模板名称' },
                { prop: 'messageName', label: '报文名称' },
                { prop: 'responseMessage', label: '响应报文' },
                { prop: 'analyzeResult', label: '解析结果' },
                { prop: 'createdTime', label: '创建时间' },
            ],
            loading: true,
            multipleSelection: [],
            gatewayOptions: [],
            templateOptions: [],
            messageOptions: [],
            analyzeStatusOptions: [
                { prop: 0, label: '成功' },
                { prop: 1, label: '失败' },
                { prop: 2, label: '异常' },
            ],
        }
    },
    created() {
        // 初始化分页列表
        this.queryPageList()
        // 获取网关下拉框
        this.getGatewayOptions()
        // 获取模板下拉框
        this.getTemplateOptions()
        // 获取报文下拉框
        this.getMessageOptions()
    },
    methods: {
        // 分页查询
        async queryPageList() {
            try {
                const response = await axios.get("/api/analyzeRecord/getPageList", {
                    params: { ...this.analyzeRecord }
                })
                this.tableData = response.data.data.list.map(item => ({
                    ...item,
                }))
                this.analyzeRecord.total = response.data.data.total
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
        // 选择模板ID
        changeTemplate(){
            this.getMessageOptions()
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
        // 获取报文列表
        async getMessageOptions() {
            try {
                const response = await axios.get("/api/message/getList",{
                    params: { templateName: this.analyzeRecord.templateName }
                });
                this.messageOptions = response.data.data;
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
                axios.post('/api/analyzeRecord/delete', row)
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
                axios.post('/api/analyzeRecord/batchDelete', this.multipleSelection)
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
            this.analyzeRecord.pageNum = val
            this.queryPageList()
        },
        // 分页插件事件
        handleSizeChange(val) {
            this.analyzeRecord.pageSize = val
            this.analyzeRecord.pageNum = 1
            this.queryPageList()
        },
        // 表格多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        // 查看模板
        handleShow(row) {
            let paramObj = {
                component: 'analyze-record-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
    }
})