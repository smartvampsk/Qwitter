<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute fullscreen">
      <div class="q-py-lg q-px-md row q-col-gutter-md items-end">
        <div class="col">
          <q-input class="new-qweet" bottom-slots v-model="newQweetContent" autogrow placeholder="What's happening?"
                   counter
                   maxlength="280">
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="avatar.png">
              </q-avatar>
            </template>
          </q-input>
        </div>

        <div class="col col-shrink">
          <q-btn @click="addNewQweet" class="q-mb-lg" unelevated rounded color="primary" no-caps label="Qweet"
                 :disable="!newQweetContent"/>
        </div>
      </div>

      <q-separator class="divider" size="10px" color="grey-2"/>
      <div>
        <q-list>
          <transition-group
            appear
            enter-active-class="animated fadeIn slow"
            leave-active-class="animated fadeOut slow"
          >
            <q-item v-for="qweet in qweets" :key="qweet.id" class="q-py-md qweet">
              <q-item-section avatar top>
                <q-avatar>
                  <img src="avatar.png">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1">
                  <strong>Santosh Khanal </strong>
                  <span class="text-grey-7">@smartvamps
                  <br class="lt-md">
                  &bull; {{ qweet.date }}
                </span>
                </q-item-label>

                <q-item-label class="qweet-content text-body1">
                  {{ qweet.content }}
                </q-item-label>
                <div class="qweet-icons row justify-between q-mt-sm">
                  <q-btn flat round color="grey" size="sm" icon="far fa-comment"></q-btn>
                  <q-btn flat round color="grey" size="sm" icon="fa fa-retweet"></q-btn>
                  <q-btn flat round size="sm"
                         :color="qweet.liked? 'red' : 'grey'"
                         :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  ></q-btn>
                  <q-btn @click="deleteQweet(qweet)" flat round color="grey" size="sm" icon="fas fa-trash-alt"></q-btn>
                </div>
              </q-item-section>
            </q-item>
          </transition-group>
        </q-list>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'
import db from 'src/boot/firebase'
import {formatDistance} from 'date-fns'

export default defineComponent({
  name: 'PageHome',
  data() {
    return {
      newQweetContent: '',
      qweets: [
        {
          content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus molestiae, pariatur. Architecto facilis nisi officia quas voluptatem. Culpa, debitis doloremque eaque eos exercitationem iste natus officiis omnis praesentium quas tempora.',
          date: '1624681611987',
          liked: false,
        },
        {
          content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus molestiae, pariatur. Architecto facilis nisi officia quas voluptatem. Culpa Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus molestiae, pariatur. Architecto facilis nisi officia quas voluptatem. Culpa, debitis doloremque eaque eos exercitationem iste natus officiis omnis praesentium quas tempora.',
          date: '1624681666162',
          liked: true,
        }
      ],
    }
  },
  computed: {},
  methods: {
    addNewQweet() {
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now()
      }
      db.collection('qweets').add(newQweet).then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
      }).catch((error) => {
        console.error('Error adding document: ', error);
      });
      this.newQweetContent = ''
    },
    deleteQweet(qweet) {
      db.collection('qweets').doc(qweet.id).delete().then(() => {
        console.log('Document successfully deleted!');
      }).catch((error) => {
        console.error('Error removing document: ', error);
      })
    },
  },

  mounted() {
    db.collection('qweets')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let qweetChange = change.doc.data()
          qweetChange.id = change.doc.id
          if (change.type === 'added') {
            console.log('new: ', qweetChange)
            this.qweets.unshift(qweetChange)
          }
          if (change.type === 'modified') {
            console.log('Modified Qweet: ', qweetChange)
          }
          if (change.type === 'removed') {
            console.log('Removed Qweet: ', qweetChange)
            let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
            this.qweets.splice(index, 1)
          }
        });
      });
  },
})
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)

.qweet-content
  white-space: pre-line

.qweet-icons
  margin-left: -5px

</style>
