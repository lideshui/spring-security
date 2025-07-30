Vue.component('template-create', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component template-create">
        <div class="title">
            <span style="color: #a1a0a0;">模板管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('template-list')">模板列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            添加设备模板
        </div>
        <el-row class="nav" :gutter="20">
          <el-col :span="24" class="nav-title">添加设备模板</el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--新增表单--> 
        <el-form :model="templateForm" ref="templateForm" :rules="templateRules" label-width="120px">
            <div class="scrollable-area">
               <div class="card-attr">模板信息</div>
               <el-row :gutter="20" class="card-attr-row" style="margin-top: 10px">
                  <el-col :span="6">
                     <el-form-item label="模板名称" prop="templateName">
                         <el-input v-model="templateForm.templateName" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6">
                     <el-form-item label="模板编码" prop="templateCode">
                         <el-input v-model="templateForm.templateCode" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6">
                     <el-form-item label="轮询方法" prop="pollingMethod">
                         <el-input v-model="templateForm.pollingMethod" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="6">
                     <el-form-item label="通信协议" prop="communicationProtocol">
                         <el-input v-model="templateForm.communicationProtocol" size="small" class="create-form-item"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row> 
            </div>
            <div class="scrollable-area" style="padding-bottom: 60px">
               <div class="card-attr">模板报文</div>
               <div style="margin: 20px 0 10px 0; display: flex; justify-content: space-between;">
                  <el-tag type="warning">
                      <i style="font-size: 16px; line-height: 16px; padding-right: 5px" class="el-icon-warning"></i>
                      为避免解析失败，同一模板下不可存在请求长度相同的报文，若冲突可适当多读取一些寄存器长度！
                  </el-tag>
                  <el-button size="mini" type="primary" @click="openCreateMessage()">添加报文</el-button>
               </div>
               <!-- 报文表格 -->
               <el-table :data="messageList" style="width: 100%">
                   <!-- 动态渲染 -->
                   <el-table-column 
                       v-for="column in messageColumns" 
                       :key="column.prop"
                       :prop="column.prop"
                       :label="column.label"
                   />
                   <!-- 操作列 -->
                   <el-table-column
                       label="操作"
                       width="120"
                       align="left">
                       <template slot-scope="scope">
                           <el-link class="link-container" type="primary" @click="openEditMessage(scope.row)">修改</el-link>
                           <el-link class="link-container" type="primary" @click="deleteMessage(scope.row)">删除</el-link>
                       </template>
                   </el-table-column>
               </el-table>
               <!-- 添加分页组件 -->
               <el-pagination
                   class="pagination-container"
                   @current-change="messageCurrentChange"
                   @size-change="messageSizeChange"
                   :current-page="messagePage.pageNum"
                   :page-sizes="[10, 20, 50]"
                   :page-size="messagePage.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="messagePage.total">
               </el-pagination>
            </div>
            <div class="scrollable-area" style="padding-bottom: 60px">
               <div class="card-attr">报文变量</div>
               <div style="margin: 10px 0 10px 0; display: flex; justify-content: space-between;">
                  <el-tag style="margin-top: 10px">
                      <i style="font-size: 16px; line-height: 16px; padding-right: 5px" class="el-icon-warning"></i>
                      录入变量时需要先选择模板报文，变量的寄存器地址以十六进制字符串的表现形式录入，如"016A"。
                  </el-tag>
                  <div>
                     <div class="el-form-item__label">
                        <span style="color: #F56C6C;margin-right: 4px;">*</span>变量所属报文
                        <el-select v-model="messageId" class="search-item" filterable clearable size="small" style="padding-left: 5px" placeholder="请选择报文" @change="handleMessageChange">
                            <el-option
                                v-for="item in messageList"
                                :key="item.messageId"
                                :label="item.messageName"
                                :value="item.messageId">
                            </el-option>
                        </el-select>
                     </div>
                     <el-button size="mini" type="primary" style="height: 32px; margin-top: 4px" @click="openCreateVariable()">添加变量</el-button>
                  </div>
               </div>
               <!-- 变量表格 -->
               <el-table :data="variableList" style="width: 100%">
                   <!-- 动态渲染 -->
                   <el-table-column 
                       v-for="column in variableColumns" 
                       :key="column.prop"
                       :prop="column.prop"
                       :label="column.label"
                   />
                   <!-- 操作列 -->
                   <el-table-column
                       label="操作"
                       width="120"
                       align="left">
                       <template slot-scope="scope">
                           <el-link class="link-container" type="primary" @click="openEditVariable(scope.row)">修改</el-link>
                           <el-link class="link-container" type="primary" @click="deleteVariable(scope.row)">删除</el-link>
                       </template>
                   </el-table-column>
               </el-table>
               <!-- 添加分页组件 -->
               <el-pagination
                   class="pagination-container"
                   @current-change="variableCurrentChange"
                   @size-change="variableSizeChange"
                   :current-page="variablePage.pageNum"
                   :page-sizes="[10, 20, 50]"
                   :page-size="variablePage.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="variablePage.total">
               </el-pagination>
            </div>
            <div style="width: 100%">
                <el-form-item style="text-align: center; margin-top: 30px">
                    <el-button type="primary" @click="createTemplate" size="medium">完成</el-button>
                </el-form-item>
            </div>
        </el-form>
        <!-- 添加报文弹窗 -->
        <el-dialog title="添加报文" :visible.sync="dialogCreateMessage" width="30%">
            <el-form :model="messageForm" ref="messageForm" :rules="messageRules" @submit.native.prevent="createMessage" label-width="80px">
                <!-- 使用栅格布局实现一行两列 -->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="报文名称" prop="messageName">
                            <el-input v-model="messageForm.messageName" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="报文内容" prop="requestMessage">
                            <el-input v-model="messageForm.requestMessage" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="报文长度" prop="requestLength">
                            <el-input v-model="messageForm.requestLength" size="small" class="create-form-item" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 按钮容器 -->
                <div class="dialog-footer">
                    <el-button @click="dialogCreateMessage = false" size="small">取 消</el-button>
                    <el-button type="primary" native-type="submit" size="small">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 修改报文弹窗 -->
        <el-dialog title="修改报文" :visible.sync="dialogEditMessage" width="30%">
            <el-form :model="messageForm" ref="messageForm" :rules="messageRules" @submit.native.prevent="editMessage" label-width="80px">
                <!-- 使用栅格布局实现一行两列 -->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="报文名称" prop="messageName">
                            <el-input v-model="messageForm.messageName" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="报文内容" prop="requestMessage">
                            <el-input v-model="messageForm.requestMessage" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="报文长度" prop="requestLength">
                            <el-input v-model="messageForm.requestLength" size="small" class="create-form-item" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 按钮容器 -->
                <div class="dialog-footer">
                    <el-button @click="dialogEditMessage = false" size="small">取 消</el-button>
                    <el-button type="primary" native-type="submit" size="small">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 添加变量弹窗 -->
        <el-dialog title="添加变量" :visible.sync="dialogCreateVariable" width="40%">
            <el-form :model="variableForm" ref="variableForm" :rules="variableRules" @submit.native.prevent="createVariable" label-width="80px">
                <!-- 使用栅格布局实现一行两列 -->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="变量名称" prop="variableName">
                            <el-input v-model="variableForm.variableName" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="变量编码" prop="variableCode">
                            <el-input v-model="variableForm.variableCode" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="寄存器" prop="registerAddress">
                            <el-input v-model="variableForm.registerAddress" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="读取长度" prop="registerLength">
                            <el-input v-model="variableForm.registerLength" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="变量单位" prop="variableUnit">
                            <el-input v-model="variableForm.variableUnit" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="变量类型" prop="variableType">
                            <el-input v-model="variableForm.variableType" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计算系数" prop="coefficient">
                            <el-input v-model="variableForm.coefficient" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 按钮容器 -->
                <div class="dialog-footer">
                    <el-button @click="dialogCreateVariable = false" size="small">取 消</el-button>
                    <el-button type="primary" native-type="submit" size="small">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 修改变量弹窗 -->
        <el-dialog title="修改报文" :visible.sync="dialogEditVariable" width="40%">
            <el-form :model="variableForm" ref="variableForm" :rules="variableRules" @submit.native.prevent="editVariable" label-width="80px">
                <!-- 使用栅格布局实现一行两列 -->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="变量名称" prop="variableName">
                            <el-input v-model="variableForm.variableName" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="变量编码" prop="variableCode">
                            <el-input v-model="variableForm.variableCode" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="寄存器" prop="registerAddress">
                            <el-input v-model="variableForm.registerAddress" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="读取长度" prop="registerLength">
                            <el-input v-model="variableForm.registerLength" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="变量单位" prop="variableUnit">
                            <el-input v-model="variableForm.variableUnit" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="变量类型" prop="variableType">
                            <el-input v-model="variableForm.variableType" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计算系数" prop="coefficient">
                            <el-input v-model="variableForm.coefficient" size="small" class="create-form-item"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 按钮容器 -->
                <div class="dialog-footer">
                    <el-button @click="dialogEditVariable = false" size="small">取 消</el-button>
                    <el-button type="primary" native-type="submit" size="small">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
    `,
    data() {
        return {
            templateForm: {
                templateId: '',
                templateName: '',
                templateCode: '',
                pollingMethod: '',
                communicationProtocol: '',
            },
            messageForm: {
                messageId: '',
                templateId: '',
                messageName: '',
                requestMessage: '',
                requestLength: '',
            },
            variableForm: {
                variableId: '',
                variableName: '',
                variableCode: '',
                variableType: '',
                variableUnit: '',
                registerAddress: '',
                registerLength: '',
                templateId: '',
                messageId: '',
                coefficient: '',
            },
            messagePage: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            variablePage: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            templateRules: {
                templateName: [{required: true, message: '请输入模板名称', trigger: 'blur'}],
                templateCode: [{required: true, message: '请输入模板编码', trigger: 'blur'}],
            },
            messageRules: {
                messageName: [{required: true, message: '请输入报文名称', trigger: 'blur'}],
                requestMessage: [{required: true, message: '请输入报文内容', trigger: 'blur'}],
            },
            variableRules : {
                variableName: [{required: true, message: '请输入变量名称', trigger: 'blur'}],
                variableCode: [{required: true, message: '请输入变量编码', trigger: 'blur'}],
                registerAddress: [{required: true, message: '寄存器地址', trigger: 'blur'}],
                registerLength: [{required: true, message: '读取长度', trigger: 'blur'}],
            },
            messageColumns: [
                { prop: 'messageName', label: '报文名称' },
                { prop: 'requestMessage', label: '报文内容' },
                { prop: 'requestLength', label: '报文长度' },
                { prop: 'createdTime', label: '创建时间' },
            ],
            variableColumns: [
                { prop: 'variableName', label: '变量名称' },
                { prop: 'variableCode', label: '变量编码' },
                { prop: 'registerAddress', label: '寄存器地址' },
                { prop: 'registerLength', label: '寄存器长度' },
                { prop: 'variableUnit', label: '变量单位' },
                { prop: 'variableType', label: '变量类型' },
                { prop: 'coefficient', label: '计算系数' },
                { prop: 'createdTime', label: '创建时间' },
            ],
            messageList: [],
            variableList: [],
            dialogCreateMessage: false,
            dialogEditMessage: false,
            dialogCreateVariable: false,
            dialogEditVariable: false,
            messageId: '',
        }
    },
    created() {},
    watch: {
        // 监听 messageForm.requestMessage 的变化
        'messageForm.requestMessage': {
            handler(newValue) {
                if (newValue.length >= 2) {
                    // 提取最后两位字符
                    const lastTwoChars = newValue.slice(-2);
                    // 尝试将最后两位十六进制字符转换为十进制
                    try {
                        this.messageForm.requestLength = parseInt(lastTwoChars, 16)*2;
                    } catch (error) {
                        console.error("转换失败:", error);
                        // 可以选择重置或保持原值
                        this.messageForm.requestLength = '';
                    }
                }
            },
        }
    },
    methods: {
        // 创建设备模板
        createTemplate() {
            if(this.templateForm.templateId == null || this.templateForm.templateId === ''){
                this.$refs['templateForm'].validate((valid) => {
                    //
                    if (valid) {
                        // 调用新增接口
                        axios.post('/api/template/add', this.templateForm)
                            .then(response => {
                                this.$message.success("新增设备模板成功");
                                this.linkPage('template-list')
                            })
                            .catch(error => {
                                this.$message.error("新增设备模板失败: " + error.message);
                            });
                    } else {
                        console.log('设备模板表单验证失败');
                        return false;
                    }
                });
            }else {
                this.linkPage('template-list')
            }
        },
        // 创建报文
        createMessage() {
            this.$refs['messageForm'].validate((valid) => {
                if (valid) {
                    // 调用新增接口
                    this.messageForm.templateId = this.templateForm.templateId
                    axios.post('/api/message/add', this.messageForm)
                        .then(response => {
                            if(response.data.data != "repeat"){
                                this.$message.success("新增报文成功");
                                // 关闭弹窗
                                this.dialogCreateMessage = false;
                                // 清空报文表单
                                this.resetMessageForm()
                                // 查询列表
                                this.queryMessagePageList()
                            }else {
                                this.$message.warning("相同读取长度的报文已存在");
                            }
                        })
                        .catch(error => {
                            this.$message.error("新增报文失败: " + error.message);
                        });
                } else {
                    console.log('设备报文验证失败');
                    return false;
                }
            });
        },
        // 查询报文
        async queryMessagePageList() {
            try {
                const response = await axios.get("/api/message/getPageList", {
                    params: {
                        templateId: this.templateForm.templateId,
                        pageNum: this.messagePage.pageNum,
                        pageSize: this.messagePage.pageSize
                    }
                })
                this.messageList = response.data.data.list.map(item => ({
                    ...item,
                }))
                this.messagePage.total = response.data.data.total
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            }
        },
        // 查询变量
        async queryVariablePageList() {
            try {
                const response = await axios.get("/api/variable/getPageList", {
                    params: {
                        messageId: this.messageId,
                        pageNum: this.variablePage.pageNum,
                        pageSize: this.variablePage.pageSize
                    }
                })
                this.variableList = response.data.data.list.map(item => ({
                    ...item,
                }))
                this.variablePage.total = response.data.data.total
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            }
        },
        // 重置模板表单
        resetTemplateForm() {
            this.$refs['templateForm'].resetFields();
        },
        // 重置报文表单
        resetMessageForm() {
            this.$refs['messageForm'].resetFields();
        },
        // 重置变量表单
        resetVariableForm() {
            this.$refs['variableForm'].resetFields();
        },
        // 跳转页面
        linkPage(component) {
            let paramObj = {
                component: component,
                data: {}
            }
            this.$emit('change-component', paramObj);
        },
        // 打开创建报文弹窗
        openCreateMessage() {
            if(this.templateForm.templateId == null || this.templateForm.templateId === ''){
                // 若还未创建模板则提前创建模板
                this.$refs['templateForm'].validate((valid) => {
                    if (valid) {
                        // 调用新增接口
                        axios.post('/api/template/add', this.templateForm)
                            .then(response => {
                                this.$message.success("新增设备模板成功");
                                // 回写设备模板ID
                                this.templateForm.templateId = response.data.data
                                // 打开弹窗
                                this.dialogCreateMessage = true;
                            })
                            .catch(error => {
                                this.$message.error("新增设备模板失败: " + error.message);
                            });
                    } else {
                        console.log('设备模板表单验证失败');
                        return false;
                    }
                });
            }else {
                // 打开弹窗
                this.dialogCreateMessage = true;
            }
        },
        // 打开修改报文弹窗
        openEditMessage(row) {
            // 打开弹窗
            this.dialogEditMessage = true;
            this.messageForm = {
                messageId: row.messageId,
                templateId: row.templateId,
                messageName: row.messageName,
                requestMessage: row.requestMessage,
                requestLength: row.requestLength
            }
        },
        // 打开修改变量弹窗
        openEditVariable(row) {
            // 打开弹窗
            this.dialogEditVariable = true;
            this.variableForm = {
                variableId: row.variableId,
                variableName: row.variableName,
                variableCode: row.variableCode,
                variableType: row.variableType,
                variableUnit: row.variableUnit,
                registerAddress: row.registerAddress,
                registerLength: row.registerLength,
                coefficient: row.coefficient,
                templateId: this.templateForm.templateId,
                messageId: this.messageId,
            }
        },
        // 打开新增变量弹窗
        openCreateVariable() {
            if(this.messageId == null || this.messageId === ''){
                this.$message.warning("请先选择变量所属报文！")
                return
            }
            this.dialogCreateVariable = true;
        },
        // 修改报文
        editMessage() {
            this.$refs['messageForm'].validate((valid) => {
                if (valid) {
                    // 调用修改接口
                    axios.post('/api/message/edit', this.messageForm)
                        .then(response => {
                            if(response.data.data != "repeat"){
                                this.$message.success("修改成功");
                                // 关闭弹窗
                                this.dialogEditMessage = false;
                                // 刷新报文列表
                                this.queryMessage ();
                                // 刷新变量列表
                                this.queryVariablePageList();
                            }else {
                                this.$message.warning("相同读取长度的报文已存在");
                            }
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
        // 修改变量
        editVariable() {
            this.$refs['variableForm'].validate((valid) => {
                if (valid) {
                    // 调用修改接口
                    axios.post('/api/variable/edit', this.variableForm)
                        .then(response => {
                            this.$message.success("修改成功");
                            // 关闭弹窗
                            this.dialogEditVariable = false;
                            // 刷新变量列表
                            this.queryVariablePageList();
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
        // 删除报文
        deleteMessage(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/message/delete', row)
                    .then(response => {
                        this.$message.success("删除成功");
                        // 刷新列表
                        this.queryMessagePageList();
                        if(row.messageId == this.messageId){
                            // 刷新变量列表
                            this.queryVariable ();
                            this.messageId = ""
                        }
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
        // 删除变量
        deleteVariable(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/variable/delete', row)
                    .then(response => {
                        this.$message.success("删除成功");
                        // 刷新列表
                        this.queryVariablePageList();
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
        createVariable() {
            this.$refs['variableForm'].validate((valid) => {
                if (valid) {
                    // 调用新增接口
                    this.variableForm.messageId = this.messageId
                    this.variableForm.templateId = this.templateForm.templateId
                    axios.post('/api/variable/add', this.variableForm)
                        .then(response => {
                            this.$message.success("新增变量成功");
                            // 关闭弹窗
                            this.dialogCreateVariable = false;
                            // 清空变量表单
                            this.resetVariableForm()
                            // 刷新列表
                            this.queryVariablePageList();
                        })
                        .catch(error => {
                            this.$message.error("新增报文失败: " + error.message);
                        });
                } else {
                    console.log('设备报文验证失败');
                    return false;
                }
            });
        },
        // 处理变量所属报文的选择事件
        handleMessageChange(){
            if(this.messageId == null || this.messageId ==='' ){
                this.variableList = []
                this.variablePage.total = 0
            }else {
                // 刷新列表
                this.queryVariablePageList();
            }
        },
        // 报文分页插件事件
        messageCurrentChange(val) {
            this.messagePage.pageNum = val
            this.queryMessagePageList()
        },
        // 报文分页插件事件
        messageSizeChange(val) {
            this.messagePage.pageSize = val
            this.messagePage.pageNum = 1
            this.queryMessagePageList()
        },
        // 变量分页插件事件
        variableCurrentChange(val) {
            this.variablePage.pageNum = val
            this.queryVariablePageList()
        },
        // 变量分页插件事件
        variableSizeChange(val) {
            this.variablePage.pageSize = val
            this.variablePage.pageNum = 1
            this.queryVariablePageList()
        },
    },
})