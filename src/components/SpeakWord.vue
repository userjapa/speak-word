<template lang="html">
  <div class="game">
    <div class="game__speech">
      <div class="game__speech__text">
        <div>
          <span ref="answer"> {{ question.text }} </span>
        </div>
      </div>
      <div class="game__speech__microphone">
        <div class="game__speech__microphone__enable"
             v-if="!supportMedia"
             :class="{ talking: talking || question.answered, colorChanging: talking }"
             @click="speak()">
          <font-awesome-icon icon="microphone"/>
        </div>
        <div class="game__speech__microphone__disable" v-else>
          <font-awesome-icon icon="microphone-slash"/>
        </div>
      </div>
      <div class="game__speech__text">
        <div>
          <span ref="text" :class="{ right: question.answered && question.hit, wrong: question.answered && !question.hit }"> {{ text }} </span>
        </div>
        <div :style="{ visibility: (played && !question.answered)?'visible':'hidden' }">
          <button @click="confirm()">Confirm</button>
        </div>
      </div>
      <div class="game__speech__options">
        <button v-if="!ended" @click="setCurrent(questions)">Next</button>
        <button v-else>Finish</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpeakWord',
  data () {
    return {
      text: '',
      supportMedia: false,
      talking: false,
      speech: null,
      question: {},
      index: 0,
      played: false,
      ended: false
    }
  },
  props: {
    questions: {
      type: Array,
      default: Array
    }
  },
  methods: {
    async setCurrent (questions) {
      let qst = {}
      for (const q_key in questions) {
        this.index = q_key
        if (!questions[q_key].answered) {
          qst = questions[q_key]
          this.played = false
          this.text = ''
          break
        } else if (q_key == (questions.length - 1)) {
          qst = questions[q_key]
          this.ended = true
          this.played = true
        }
      }
      await this.$set(this, 'question', qst)
      await this.syncWidth()
    },
    speak () {
      if (!this.talking && !this.question.answered) {
        this.speech.start()
      }
    },
    async syncWidth () {
      return new Promise(resolve => {
        setTimeout(() => {
          const text = this.$refs['text']
          const answer = this.$refs['answer']

          text.style.width = `${answer.offsetWidth}px`;
          resolve()
        }, 500)
      })
    },
    confirm () {
      this.$set(this.question, 'answered', true)
      const answer = this.text
      const text = this.question.text
      const answerReduced = answer.replace(/[\.?!,]+/g, '').toLowerCase().trim().toLowerCase()
      const textReduced = text.replace(/[\.?!,]+/g, '').toLowerCase().trim().toLowerCase()
      if (answerReduced === textReduced) this.$set(this.question, 'hit', true)
      else this.$set(this.question, 'hit', false)
    }
  },
  watch: {
    questions (questions) {
      this.setCurrent(questions)
    }
  },
  beforeMount () {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    let speech = new SpeechRecognition()
    speech.lang = 'en-US'
    speech.interimResults = false
    speech.maxAlternatives = 5

    speech.onaudiostart = () => {
      this.talking = true
    }
    speech.onend = () => {
      this.talking = false
    }
    speech.onerror = err => {
      alert('Error getting Speech!')
    }
    speech.onresult = ev => {
      let answer = ev.results[0][0].transcript
      this.text = answer
      this.talking = false
      this.played = true
    }
    this.speech = speech
  },
  mounted () {
    this.setCurrent(this.questions)
  }
}
</script>

<style lang="scss">
  $color-red: #c2003c;

  .game {
    width: 100%;
    height: 100%;
    &__speech {
      padding: 20px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      position: relative;
      &__microphone {
        margin-bottom: 5px;
        align-self: center;
        &__enable {
          padding: 32.5px 42px;
        }
        &__disable {
          padding: 32.5px 25px;
        }
        div {
          position: relative;
          display: inline-flex;
          font-size: 60px;
          border-radius: 150px;
          border: 5px solid #aaa;
          color: #888;
          transition: all .2s;
          cursor: pointer;
          svg {
            transition: all .2s;
            transform: scale(1.25);
          }
          &:hover {
            color: #aaa;
            svg {
              transform: scale(1.5);
            }
          }
          &.talking {
            border-color: $color-red;
            svg {
              color: #c2003c;
            }
          }
          &.colorChanging {
            svg {
              animation: changeColor 2.5s infinite;
            }
          }
        }
      }
      &__text {
        align-self: center;
        &:first-child {
          margin-bottom: 5px;
        }
        div {
          text-align: center;
          span {
            display: inline-block;
            background-color: #ff9c00;
            padding: 0px 30px;
            margin: 5px;
            border-radius: 50px;
            color: #fff;
            height: 40px;
            &.right {
              background-color: #5ec12d;
            }
            &.wrong {
              background-color: $color-red;
            }
          }
          button {
            border: 2px solid #ddd;
            padding: 5px 15px;
            font-size: 16px;
            background-color: #ddd;
            border-radius: 5px;
            transition: all .2s;
            color: #222;
            &:active,
            &:focus {
              outline: none;
            }
            &:hover {
              color: #666;
              background-color: #fff;
            }
          }
        }
      }
      &__options {
        padding-bottom: 47.5px;
        padding-right: 30px;
        position: absolute;
        align-self: flex-end;
        bottom: 0;
      }
    }
  }

  @keyframes changeColor {
    0% {
      color: $color-red;
    }
    25% {
      color: lighten($color-red, 5);
    }
    50% {
      color: $color-red;
    }
    75% {
      color: darken($color-red, 10);
    }
    100% {
      color: $color-red;
    }
  }
</style>
