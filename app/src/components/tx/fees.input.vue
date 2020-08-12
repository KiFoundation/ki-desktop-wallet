<template>
  <div class="fee-set mt-5">
    <div class="d-flex align-items-center justify-content-between">
      <label class="my-0">{{ $t('webwallet_fee') }}</label>
      <!-- <div class="setBtn">
        <toggle-button
          :value="value.advanced"
          :labels="{ checked: 'Advanced', unchecked: 'Simple' }"
          :color="{
            checked: '#062ca3',
            unchecked: '#B38100',
            disabled: '#CCCCCC',
          }"
          :font-size="12"
          :width="105"
          :height="28"
          @input="handleChangeSimple"
        />
      </div> -->
      <a @click="handleChangeSimple(!value.advanced)" class="mode-link">{{
        (value.advanced && 'Simple mode') || 'Advanced mode'
      }}</a>
    </div>

    <ul v-if="!value.advanced" class="basic-group clearfix mt-3">
      <li ref="slider" class="amount slider">
        <div ref="thunk" class="thunk" :style="{ left }">
          <div class="block">
            <img src="static/img/icons/slider@2x.png" width="16" />
          </div>
        </div>
        <div class="cheap">
          {{ $t('webwallet_cheap') }}
        </div>
        <div class="fast">
          {{ $t('webwallet_fast') }}
        </div>
      </li>
      <li class="token">
        <div class="input">{{ value.fee.toFixed(6) }} {{ token }}</div>
      </li>
    </ul>

    <ul v-else-if="value.advanced" class="basic-group clearfix mt-3">
      <div class="d-block">
        <span>Gas Price ({{ token }})</span>
        <input v-model="value.gasPrice" type="text" placeholder="0" />
      </div>
      <div class="d-flex w-100 align-items-end justify-content-between mt-3">
        <div>
          <span>Gas Limit</span>
          <input v-model="value.gasLimit" type="text" placeholder="0" />
        </div>
        <div class="token">
          <div class="input">{{ feeCompute.toFixed(6) }} {{ token }}</div>
        </div>
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      simple: true,
      slider: null,
      thunk: null,
      progress: {
        per: 50,
        min: 50,
        max: 100,
      },
      token: this.globalData.kichain.token,
    };
  },
  computed: {
    // slider stuff
    scale() {
      return (
        (this.progress.per - this.progress.min) /
        (this.progress.max - this.progress.min)
      );
    },
    width() {
      if (this.slider) {
        return this.slider.offsetWidth * this.scale + 'px';
      } else {
        return 0 + 'px';
      }
    },
    left() {
      if (this.slider) {
        var left =
          this.slider.offsetWidth * this.scale - this.thunk.offsetWidth / 2;

        if (left <= 0) {
          left = 0;
        } else if (left >= this.slider.offsetWidth - this.thunk.offsetWidth) {
          left = this.slider.offsetWidth - this.thunk.offsetWidth;
        }
        return left + 'px';
      } else {
        return '0px';
      }
    },
    feeCompute() {
      return this.value.gasPrice * this.value.gasLimit;
    },
  },
  watch: {
    value() {
      this.$emit('input', this.value);
    },
  },
  mounted() {
    setTimeout(() => {
      this.progressSlide();
    }, 100);
  },
  destroyed() {
    this.simple = true;
  },
  methods: {
    handleChangeSimple(advanced) {
      this.value.advanced = advanced;
      if (!advanced) {
        setTimeout(() => {
          this.progressSlide();
        }, 100);
      }
    },
    progressSlide() {
      this.slider = this.$refs.slider;
      this.thunk = this.$refs.thunk;
      let _this = this;
      this.value.fee = 0.015 * (this.progress.per / this.progress.max);
      this.thunk.onmousedown = function(e) {
        let width = parseInt(_this.width);
        let disX = e.clientX;
        document.onmousemove = function(e) {
          let newWidth = e.clientX - disX + width;
          let scale = newWidth / _this.slider.offsetWidth;
          let max = _this.progress.max;
          let min = _this.progress.min;

          _this.progress.per = Math.ceil((max - min) * scale + min);
          _this.progress.per = Math.max(_this.progress.per, min);
          _this.progress.per = Math.min(_this.progress.per, max);
          _this.value.fee = Math.round(0.015 * (_this.progress.per / max).toFixed(6)*10000)/10000;
        };
        document.onmouseup = function(e) {
          document.onmousemove = document.onmouseup = null;
        };
        return false;
      };

    },
  },
};
</script>

<style scoped>
span,
input,
.input {
  font-size: 13px;
}
.setBtn {
  border: none;
}
.mode-link {
  font-size: 13px;
  color: #ccc;
  transition: color 250ms ease;
}
.mode-link:hover {
  color: var(--textColor);
}
</style>
