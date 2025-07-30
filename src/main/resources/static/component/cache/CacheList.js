Vue.component('cache-list', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component">
        <div class="title"><span style="color: #a1a0a0;">缓存管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>缓存列表</div>
        <el-row class="nav" :gutter="20">
          <el-col :span="3" class="nav-title">缓存列表</el-col>
          <el-col :offset="12" :span="9" class="nav-right">
            <el-button size="mini" type="primary" @click="updateInit" plain>更新缓存</el-button>
            <el-button size="mini" type="primary" @click="handleCleanAll" plain>清空缓存</el-button>
            <el-button size="mini" @click="handleBatchDelete">批量删除</el-button>
          </el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--搜索框-->
        <div class="search-container">
            <el-input v-model="cache.prefix" class="search-item" style="width: 250px" clearable size="small" placeholder="请输入缓存类型"></el-input>
            <el-select v-model="cache.prefix"  class="search-item" style="width: 250px" filterable clearable size="small" placeholder="请选择缓存类型">
                <el-option
                        v-for="item in prefixOptions"
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
            <!-- 序号 -->
            <el-table-column
                type="index"
                label="序号"
                width="50">
            </el-table-column>
            <!-- 缓存Key -->
            <el-table-column
              prop="cacheKey"
              label="缓存Key"
              width="350"
              show-overflow-tooltip
            >
               <template slot-scope="scope">
                  <span>{{ scope.row.cacheKey }}</span>
               </template>
            </el-table-column>
            <!-- 缓存值 -->
            <el-table-column
              prop="cacheValue"
              label="缓存Value"
              show-overflow-tooltip
            >
               <template slot-scope="scope">
                  <span>{{ scope.row.cacheValue }}</span>
               </template>
            </el-table-column>
            <!-- 生命周期 -->
            <el-table-column
              prop="cacheKey"
              label="生命周期"
              width="150"
              show-overflow-tooltip
            >
                <template slot-scope="scope">
                   <span>{{ scope.row.ttl }}</span>
                </template>
            </el-table-column>
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
            :current-page="cache.pageNum"
            :page-sizes="[10, 20, 50]"
            :page-size="cache.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="cache.total">
        </el-pagination>
    </div>
    `,
    data() {
        return {
            cache: {
                cacheKey: '',
                templateId: '',
                messageName: '',
                requestMessage: '',
                requestLength: '',
                prefix: '',
                // 分页参数
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
            tableColumns: [
                { prop: 'cacheKey', label: '缓存Key' },
                { prop: 'ttl', label: '生命周期' }
            ],
            loading: true,
            multipleSelection: [],
            ttlTimers: {}, // 用于存储每个 ttl 的定时器
            prefixOptions: [
                { prop: 'acquisition', label: '采集点缓存' },
                { prop: 'response', label: '解析对象缓存' },
                { prop: 'request', label: '请求网关缓存' },
            ],
        }
    },
    created() {
        // 初始化分页列表
        this.queryPageList()
    },
    beforeDestroy() {
        // 清除所有定时器
        for (let key in this.ttlTimers) {
            clearInterval(this.ttlTimers[key]);
        }
    },
    methods: {
        // 分页查询
        async queryPageList() {
            try {
                const response = await axios.get("/api/cache/getPageList", {
                    params: { ...this.cache }
                })
                this.tableData = response.data.data.list.map(item => ({
                    ...item,
                    originalTtl: item.ttl // 存储原始 ttl 值
                }))
                this.cache.total = response.data.data.total

                // 启动或重启定时器
                this.startTtlCountdowns();
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            } finally {
                this.loading = false
            }
        },
        // 点击查询按钮
        clickQueryButton(){
            this.cache.pageNum = 1
            this.queryPageList()
        },
        // 清空缓存
        handleCleanAll(){
            this.$confirm('此操作将清空全部缓存, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用接口
                axios.post('/api/cache/clearAll')
                    .then(response => {
                        this.$message.success("清空缓存成功");
                        // 刷新列表
                        this.queryPageList();
                    })
                    .catch(error => {
                        this.$message.error("清空缓存失败: " + error.message);
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消清空缓存'
                })
            })
        },
        // 更新缓存
        updateInit(){
            this.$confirm('此操作将更新全部解析对象和请求网关缓存, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用接口
                axios.post('/api/cache/updateInit')
                    .then(response => {
                        this.$message.success("更新缓存成功");
                        // 刷新列表
                        this.queryPageList();
                    })
                    .catch(error => {
                        this.$message.error("更新缓存失败: " + error.message);
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消更新缓存'
                })
            })
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/cache/delete', row)
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
                axios.post('/api/cache/batchDelete', this.multipleSelection)
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
            this.cache.pageNum = val
            this.queryPageList()
        },
        // 分页插件事件
        handleSizeChange(val) {
            this.cache.pageSize = val
            this.cache.pageNum = 1
            this.queryPageList()
        },
        // 表格多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        // 查看
        handleShow(row) {
            let paramObj = {
                component: 'cache-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 启动或重启 ttl 倒计时
        startTtlCountdowns() {
            // 清除现有定时器
            for (let key in this.ttlTimers) {
                clearInterval(this.ttlTimers[key]);
            }

            // 启动新的定时器
            this.tableData.forEach(item => {
                if (item.originalTtl > 0) {
                    this.updateTtl(item);
                    this.ttlTimers[item.cacheKey] = setInterval(() => {
                        this.updateTtl(item);
                    }, 1000); // 每秒更新一次
                }
            });
        },
        // 更新 ttl 值
        updateTtl(item) {
            if (item.ttl > 0) {
                item.ttl -= 1;
            } else {
                clearInterval(this.ttlTimers[item.cacheKey]);
            }
        },
    }
});



