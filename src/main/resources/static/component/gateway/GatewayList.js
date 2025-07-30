Vue.component('gateway-list', {
    props: {},
    template: `
    <div class="component">
        <div class="title">
            <span style="color: #a1a0a0;">网关管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            网关列表
        </div>
        <el-row class="nav" :gutter="20">
          <el-col :span="3" class="nav-title">网关列表</el-col>
          <el-col :span="12" class="nav-middle">
            <div class="nav-middle-info">
                <div class="nav-middle-title">网关总数</div>
                <div class="nav-middle-value">{{totalNumber}}</div>
            </div>
            <el-divider class="nav-middle-line" direction="vertical"></el-divider>
            <div>
                <div class="nav-middle-title" style="color: #13ce66"><i class="el-icon-upload"></i> 在线网关</div>
                <div class="nav-middle-value">{{onlineNumber}}</div>
            </div>
            <el-divider class="nav-middle-line" direction="vertical"></el-divider>
            <div>
                <div class="nav-middle-title" style="color: #cd6767"><i class="el-icon-upload"></i> 离线网关</div>
                <div class="nav-middle-value">{{offlineNumber}}</div>
            </div>
            <el-divider class="nav-middle-line" direction="vertical"></el-divider>
            <div>
                <div class="nav-middle-title" style="color: #f1a633"><i class="el-icon-upload"></i> 停用网关</div>
                <div class="nav-middle-value">{{deactivateNumber}}</div>
            </div>
          </el-col>
          <el-col :span="9" class="nav-right">
            <el-tag style="color: #666666; height: 25px; line-height: 25px; padding: 0 20px !important; margin-right: 10px;"><i class="el-icon-warning"></i> 修改网关任何相关信息需要在此处更新缓存</el-tag>
            <el-button size="mini" type="primary" @click="updateCache">更新缓存</el-button>
            <el-button size="mini" type="primary" @click="handleCreate">添加网关</el-button>
            <el-button size="mini" @click="handleBatchDelete">批量删除</el-button>
          </el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--搜索框-->
        <div class="search-container">
            <el-input v-model="gateway.gatewayName" class="search-item" clearable size="small" placeholder="请输入网关名称"></el-input>
            <el-input v-model="gateway.gatewayCode" class="search-item" clearable size="small" placeholder="请输入网关编码"></el-input> 
            <el-input v-model="gateway.gatewayIp" class="search-item" clearable size="small" placeholder="请输入网关IP"></el-input> 
            <el-input v-model="gateway.heartbeat" class="search-item" clearable size="small" placeholder="请输入网关心跳包"></el-input> 
            <el-input v-model="gateway.gatewaySn" class="search-item" clearable size="small" placeholder="请输入网关SN"></el-input> 
            <el-select v-model="gateway.gatewayStatus" class="search-item" filterable clearable size="small" placeholder="请选择网关状态">
                <el-option
                        v-for="item in gatewayStatusOptions"
                        :key="item.prop"
                        :label="item.label"
                        :value="item.prop">
                </el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="handleQuery()">查询</el-button>
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
                label="网关状态"
                width="150">
                align="left">
                <template slot-scope="scope">
                    <span v-if="scope.row.gatewayStatus === 0" style="color: #13ce66"><i class="el-icon-upload"></i> 在线</span>
                    <span v-else-if="scope.row.gatewayStatus === 1" style="color: #cd6767"><i class="el-icon-upload"></i> 离线</span>
                    <span v-else-if="scope.row.gatewayStatus === 2" style="color: #f1a633"><i class="el-icon-upload"></i> 停用</span>
                    <span v-else style="color: #b3b5b4"><i class="el-icon-upload"></i> 无效状态</span>
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
            :current-page="gateway.pageNum"
            :page-sizes="[10, 20, 50]"
            :page-size="gateway.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="gateway.total">
        </el-pagination>
    </div>
    `,
    data() {
        return {
            gateway: {
                gatewayName: '',
                gatewayCode: '',
                gatewayIp: '',
                gatewaySn: '',
                heartbeat: '',
                gatewayStatus: '',
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
            tableColumns: [
                { prop: 'gatewayName', label: '网关名称' },
                { prop: 'gatewayCode', label: '网关编码' },
                { prop: 'gatewayIp', label: '网关IP' },
                { prop: 'gatewaySn', label: '网关SN' },
                { prop: 'heartbeat', label: '心跳包' },
                { prop: 'createdTime', label: '创建时间' }
            ],
            gatewayStatusOptions: [
                { prop: 0, label: '在线' },
                { prop: 1, label: '离线' },
                { prop: 2, label: '停用' },
            ],
            loading: true,
            multipleSelection: [],
            onlineNumber: 0,
            offlineNumber: 0,
            deactivateNumber: 0,
            totalNumber: 0,
        }
    },
    created() {
        // 查询网关分页
        this.queryPageList()
        // 获取网关在线情况
        this.getGatewayOnlineStatus()
    },
    methods: {
        // 分页查询
        async queryPageList() {
            try {
                const response = await axios.get("/api/gateway/getPageList", {
                    params: { ...this.gateway }
                })
                this.tableData = response.data.data.list.map(item => ({
                    ...item,
                }))
                this.gateway.total = response.data.data.total
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            } finally {
                this.loading = false
            }
        },
        // 分页条件搜索
        handleQuery() {
            this.gateway.pageNum = 1
            this.queryPageList();
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/gateway/delete', row)
                    .then(response => {
                        this.$message.success("删除成功");
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
                axios.post('/api/gateway/batchDelete', this.multipleSelection)
                    .then(response => {
                        this.$message.success("批量删除成功");
                        this.multipleSelection = []
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
            })
        },
        // 更新网关缓存
        updateCache() {
            axios.get('/api/gateway/updateAllCache')
                .then(response => {
                    this.$message.success("更新缓存成功");
                })
                .catch(error => {
                    this.$message.error("更新缓存失败: " + error.message);
                });
        },
        // 获取网关在线情况
        getGatewayOnlineStatus() {
            axios.get('/api/gateway/getGatewayOnlineStatus')
                .then(response => {
                     this.onlineNumber = response.data.data.status1
                     this.offlineNumber = response.data.data.status2
                     this.deactivateNumber = response.data.data.status3
                     this.totalNumber = response.data.data.total
                })
                .catch(error => {
                    console.error("获取网关在线情况异常:", error)
                    this.$message.error(`获取网关在线情况失败: ${error.message}`)
                });
        },
        // 分页插件事件
        handleCurrentChange(val) {
            this.gateway.pageNum = val
            this.queryPageList()
        },
        // 分页插件事件
        handleSizeChange(val) {
            this.gateway.pageSize = val
            this.gateway.pageNum = 1
            this.queryPageList()
        },
        // 表格多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 新增网关
        handleCreate() {
            let paramObj = {
                component: 'gateway-create',
                data: {}
            }
            this.$emit('change-component', paramObj);
        },
        // 查看详情
        handleShow(row) {
            let paramObj = {
                component: 'gateway-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 修改数据
        handleEdit(row) {
            let paramObj = {
                component: 'gateway-edit',
                data: row
            }
            this.$emit('change-component', paramObj);
        }
    }
})