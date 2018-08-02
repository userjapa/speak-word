<template lang="html">
  <div class="create">
    <h5>Create</h5>
    <div class="create__box">
      <div class="create__box__game">
        <SpeakWord :questions="questionCopy"/>
      </div>
      <div class="create__box__form">
        <div class="create__box__form__questions">
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Word</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(q, index) in questions">
                <td>{{ index }})</td>
                <td>{{ q.text }}</td>
                <td>
                  <button class="btn-edit" @click="edit(index, q)" :disabled="isToUpdate">Edit</button>
                  <button class="btn-delete" @click="remove(index)" :disabled="isToUpdate">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="create__box__form__question">
          <form @submit.prevent="addQuestion(question)">
            <div class="create__box__form__question__field">
              <div class="create__box__form__question__field__label">
                <label for="word">Word</label>
              </div>
              <div class="create__box__form__question__field__input">
                <input id="word" v-model="question.text">
              </div>
            </div>
            <div class="create__box__form__question__submit">
              <button type="submit" v-if="!isToUpdate">Add Question</button>
              <button @click.prevent="update(question)" v-else>Update</button>
              <button @click.prevent="cancel()" v-if="isToUpdate">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import SpeakWord from '@/components/SpeakWord'

export default {
  name: 'Create',
  data () {
    return {
      questions: [],
      question: {
        text: ''
      },
      toUpdate: null
    }
  },
  computed: {
    questionCopy () {
      let question = _.cloneDeep(this.question)
      question.answered = false
      question.hit = false
      return [question]
    },
    isToUpdate ({ toUpdate }) {
      if (toUpdate == null) return false
      else return true
    }
  },
  components: {
    SpeakWord
  },
  methods: {
    addQuestion (question) {
      if (question.text == '') alert('Word must be informed!')
      else {
        this.questions.push(question)
        this.question = {
          text: ''
        }
      }
    },
    edit (index, question) {
      this.toUpdate = index
      this.question = question
    },
    update (question) {
      this.$set(this.questions, this.toUpdate, question)
      this.cancel()
    },
    cancel () {
      this.toUpdate = null
      this.question = {
        text: ''
      }
    },
    remove (index) {
      this.$delete(this.questions, index)
    }
  }
}
</script>

<style lang="scss">
  .create {
    height: 100%;
    font-size: 3rem;
    h5 {
      text-align: center;
    }
    &__box {
      height: 100%;
      display: grid;
      grid-template-rows: .5fr 1fr;
      &__form {
        display: grid;
        grid-template-columns: .5fr .5fr;
        &__questions {
          table {
            width: 100%;
            tr {
              text-align: center;
            }
          }
        }
        &__question {
          display: flex;
          justify-content: center;
          padding: 15px;
          form {
            height: 100%;
            width: 100%;
          }
          &__field {
            padding: 5px 20px;
            width: 100%;
            display: flex;
            justify-content: center;
            &__label {
              align-self: center;
              flex-basis: 100px;
              text-align: center;
            }
            &__input {
              flex-basis: 300px;
              input {
                position: relative;
                top: -5px;
                height: 100%;
                width: 100%;
                font-size: 20px;
                border: 2px solid #ddd;
                border-radius: 10px;
                &:focus,
                &:active {
                  outline: none;
                  border-color: darken(#ddd, 10);
                }
              }
            }
          }
          &__submit {
            display: flex;
            justify-content: center;
            padding: 10px 20px;
            button {
              width: 200px;
              border: 2px solid #ddd;
              border-radius: 10px;
              padding: 5px;
              cursor: pointer;
              &[type=submit] {
                width: 400px;
              }
              &:hover {
                background-color: darken(#ddd, 10);
                border-color: darken(#ddd, 10);
              }
            }
          }
        }
      }
    }
  }
</style>
