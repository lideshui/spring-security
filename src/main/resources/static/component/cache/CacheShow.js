Vue.component('cache-show', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component cache-show">
        <div class="title">
            <span style="color: #a1a0a0;">缓存管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('cache-list')">缓存列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            缓存详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="缓存详情" name="first">
                   <el-card>
                      <el-row>
                          <el-col :span="24">
                              <div class="card-nav">{{data.cacheKey}}</div>
                              <div class="card-desc">剩余过期时间: {{remainingTtl}} 秒</div>
                              <el-divider></el-divider>
                          </el-col>
                      </el-row>
<pre><code class="language-javascript line-numbers">{{data.cacheValue}}</code></pre>
                   </el-card>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
    `,
    data() {
        return {
            activeName: 'first',
            remainingTtl: this.data.ttl || 0, // 初始化剩余 TTL
            intervalId: null, // 定时器 ID
        };
    },
    created() {
        // 开始倒计时
        this.startCountdown();
    },
    beforeDestroy() {
        // 清除定时器，防止内存泄漏
        this.stopCountdown();
    },
    mounted() {
        // 确保 Prism.js 在组件挂载后重新初始化
        this.$nextTick(() => {
            Prism.highlightAll();
        });
    },
    methods: {
        // 开始倒计时
        startCountdown() {
            if (this.remainingTtl > 0) {
                this.intervalId = setInterval(() => {
                    this.remainingTtl -= 1;
                    if (this.remainingTtl <= 0) {
                        this.remainingTtl = 0; // 确保不出现负数
                        this.stopCountdown(); // 停止定时器
                    }
                }, 1000);
            }
        },
        // 停止倒计时
        stopCountdown() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        },
        // 标签切换
        handleClick(tab) {},
        // 跳转页面
        linkPage(component) {
            let paramObj = {
                component: component,
                data: {}
            };
            this.$emit('change-component', paramObj);
        },
    },
});