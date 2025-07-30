Vue.component('quartz-cron-generator', {
    template: `
    <div class="component cron-generator">
        <!-- 输入展示 -->
        <el-input
                v-model="cronExpression"
                placeholder="生成的Cron表达式"
                style="margin-bottom: 20px"
                readonly
        >
            <template slot="prepend">结果</template>
        </el-input>

        <!-- 配置项 -->
        <el-form label-width="120px">
            <!-- 秒 -->
            <el-form-item label="秒">
                <el-select v-model="config.second.type" @change="generateCron" size="small">
                    <el-option label="每秒钟" value="*"></el-option>
                    <el-option label="具体秒数" value="specific"></el-option>
                    <el-option label="间隔秒数" value="interval"></el-option>
                </el-select>
                <el-input-number
                        v-if="config.second.type === 'specific'"
                        v-model="config.second.value"
                        :min="0"
                        :max="59"
                        @change="generateCron"
                        size="small"
                ></el-input-number>
                <el-input
                        v-if="config.second.type === 'interval'"
                        v-model="config.second.interval"
                        placeholder="例如: 5"
                        @change="generateCron"
                        size="small"
                ></el-input>
            </el-form-item>

            <!-- 分钟 -->
            <el-form-item label="分钟">
                <el-select v-model="config.minute.type" @change="generateCron" size="small">
                    <el-option label="每分钟" value="*"></el-option>
                    <el-option label="具体分钟" value="specific"></el-option>
                    <el-option label="间隔分钟" value="interval"></el-option>
                    <el-option label="特定分钟" value="specificList"></el-option>
                </el-select>
                <el-input-number
                        v-if="config.minute.type === 'specific'"
                        v-model="config.minute.value"
                        :min="0"
                        :max="59"
                        @change="generateCron"
                        size="small"
                ></el-input-number>
                <el-input
                        v-if="config.minute.type === 'interval'"
                        v-model="config.minute.interval"
                        placeholder="例如: 5"
                        @change="generateCron"
                        size="small"
                ></el-input>
                <el-input
                        v-if="config.minute.type === 'specificList'"
                        v-model="config.minute.specificList"
                        placeholder="例如: 0,10,20,30,40,50"
                        @change="generateCron"
                        size="small"
                ></el-input>
            </el-form-item>

            <!-- 小时 -->
            <el-form-item label="小时">
                <el-select v-model="config.hour.type" @change="generateCron" size="small">
                    <el-option label="每小时" value="*"></el-option>
                    <el-option label="具体小时" value="specific"></el-option>
                    <el-option label="间隔小时" value="interval"></el-option>
                </el-select>
                <el-input-number
                        v-if="config.hour.type === 'specific'"
                        v-model="config.hour.value"
                        :min="0"
                        :max="23"
                        @change="generateCron"
                        size="small"
                ></el-input-number>
                <el-input
                        v-if="config.hour.type === 'interval'"
                        v-model="config.hour.interval"
                        placeholder="例如: 5"
                        @change="generateCron"
                        size="small"
                ></el-input>
            </el-form-item>

            <!-- 日 -->
            <el-form-item label="日">
                <el-select v-model="config.day.type" @change="generateCron" size="small">
                    <el-option label="每天" value="*"></el-option>
                    <el-option label="具体日期" value="specific"></el-option>
                </el-select>
                <el-input-number
                        v-if="config.day.type === 'specific'"
                        v-model="config.day.value"
                        :min="1"
                        :max="31"
                        @change="generateCron"
                        size="small"
                ></el-input-number>
            </el-form-item>

            <!-- 月 -->
            <el-form-item label="月">
                <el-select v-model="config.month.type" @change="generateCron" size="small">
                    <el-option label="每月" value="*"></el-option>
                    <el-option label="具体月份" value="specific"></el-option>
                </el-select>
                <el-input-number
                        v-if="config.month.type === 'specific'"
                        v-model="config.month.value"
                        :min="1"
                        :max="12"
                        @change="generateCron"
                        size="small"
                ></el-input-number>
            </el-form-item>

            <!-- 周 -->
            <el-form-item label="周">
                <el-select v-model="config.week.type" @change="generateCron" size="small">
                    <el-option label="每周" value="?"></el-option>
                    <el-option label="不指定" value="?"></el-option>
                    <el-option label="具体星期" value="specific"></el-option>
                </el-select>
                <el-select
                        v-if="config.week.type === 'specific'"
                        v-model="config.week.value"
                        @change="generateCron"
                        size="small"
                >
                    <el-option label="星期日" value="SUN"></el-option>
                    <el-option label="星期一" value="MON"></el-option>
                    <el-option label="星期二" value="TUE"></el-option>
                    <el-option label="星期三" value="WED"></el-option>
                    <el-option label="星期四" value="THU"></el-option>
                    <el-option label="星期五" value="FRI"></el-option>
                    <el-option label="星期六" value="SAT"></el-option>
                </el-select>
            </el-form-item>

            <!-- 预设模板 -->
            <el-form-item label="快速模板">
                <el-radio-group v-model="preset" @change="applyPreset">
                    <el-radio-button label="daily">每天</el-radio-button>
                    <el-radio-button label="hourly">每小时</el-radio-button>
                    <el-radio-button label="weekly">每周一</el-radio-button>
                    <el-radio-button label="every5Minutes">每5分钟</el-radio-button>
                    <el-radio-button label="specificMinutes">特定分钟</el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <!-- 按钮容器 -->
        <div class="dialog-footer">
            <el-button type="primary" size="small" @click="returnQuartzCron">确 定</el-button>
        </div>
    </div>
    `,
    data() {
        return {
            cronExpression: '',
            preset: 'daily',
            config: {
                second: { type: '*', value: 0, interval: '' },
                minute: { type: '*', value: 0, interval: '', specificList: '' },
                hour: { type: '*', value: 0, interval: '' },
                day: { type: '*', value: 1 },
                month: { type: '*', value: 1 },
                week: { type: '?', value: 'MON' }
            }
        }
    },
    methods: {
        generateCron() {
            const parts = [
                this.config.second.type === '*' ? '*' :
                    this.config.second.type === 'specific' ? this.config.second.value :
                        `*/${this.config.second.interval}`,
                this.config.minute.type === '*' ? '*' :
                    this.config.minute.type === 'specific' ? this.config.minute.value :
                        this.config.minute.type === 'interval' ? `*/${this.config.minute.interval}` :
                            this.config.minute.specificList,
                this.config.hour.type === '*' ? '*' :
                    this.config.hour.type === 'specific' ? this.config.hour.value :
                        `*/${this.config.hour.interval}`,
                this.config.day.type === '*' ? '*' : this.config.day.value,
                this.config.month.type === '*' ? '*' : this.config.month.value,
                this.config.week.type === '?' ? '?' : this.config.week.value
            ];
            this.cronExpression = parts.join(' ');
        },
        applyPreset(preset) {
            switch(preset) {
                case 'daily':
                    Object.assign(this.config, {
                        second: { type: 'specific', value: 0, interval: '' },
                        minute: { type: 'specific', value: 0, interval: '', specificList: '' },
                        hour: { type: 'specific', value: 12, interval: '' },
                        day: { type: '*', value: 1 },
                        month: { type: '*', value: 1 },
                        week: { type: '?', value: 'MON' }
                    });
                    break;
                case 'hourly':
                    Object.assign(this.config, {
                        second: { type: 'specific', value: 0, interval: '' },
                        minute: { type: 'specific', value: 0, interval: '', specificList: '' },
                        hour: { type: '*', value: 0, interval: '' },
                        day: { type: '*', value: 1 },
                        month: { type: '*', value: 1 },
                        week: { type: '?', value: 'MON' }
                    });
                    break;
                case 'weekly':
                    Object.assign(this.config, {
                        second: { type: 'specific', value: 0, interval: '' },
                        minute: { type: 'specific', value: 0, interval: '', specificList: '' },
                        hour: { type: 'specific', value: 8, interval: '' },
                        day: { type: '*', value: 1 },
                        month: { type: '*', value: 1 },
                        week: { type: 'specific', value: 'MON' }
                    });
                    this.cronExpression = '0 0 8 ? * MON';
                    return;
                case 'every5Minutes':
                    Object.assign(this.config, {
                        second: { type: 'specific', value: 0, interval: '' },
                        minute: { type: 'interval', value: 0, interval: '5', specificList: '' },
                        hour: { type: '*', value: 0, interval: '' },
                        day: { type: '*', value: 1 },
                        month: { type: '*', value: 1 },
                        week: { type: '?', value: 'MON' }
                    });
                    break;
                case 'specificMinutes':
                    Object.assign(this.config, {
                        second: { type: 'specific', value: 0, interval: '' },
                        minute: { type: 'specificList', value: 0, interval: '', specificList: '0,10,20,30,40,50' },
                        hour: { type: '*', value: 0, interval: '' },
                        day: { type: '*', value: 1 },
                        month: { type: '*', value: 1 },
                        week: { type: '?', value: 'MON' }
                    });
                    break;
            }
            this.generateCron();
        },
        // 向父组件传参
        returnQuartzCron(){
            this.$emit('change-component', this.cronExpression);
        }
    },
    mounted() {
        this.applyPreset('daily');
    }
})