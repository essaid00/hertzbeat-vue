<template>
  <q-page class="flex bg-image flex-center">
    <q-card flat :style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }">
      <q-card-section>
        <q-avatar
          size="110px"
          class="absolute-center shadow-10"
          :color="$q.dark.isActive ? 'blue-grey-9' : 'white'"
        >
          <img class="logo" src="../assets/brand.svg" alt="" />
        </q-avatar>
      </q-card-section>

      <q-card-section>
        <div class="text-center q-pt-lg">
          <div class="col text-h6 ellipsis">
            <translate>Log in</translate> @ HertzBeat
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="login">
          <q-input
            v-model="model.username"
            autofocus
            lazy-rules
            outlined
            :rules="[(val) => !!val || $gettext('* Required')]"
          >
            <template #label>
              <translate>User</translate>
            </template>

            <template #prepend>
              <q-icon :name="modelIcon('users')" />
            </template>
          </q-input>

          <q-input
            id="password"
            v-model="model.password"
            lazy-rules
            outlined
            counter
            :rules="[
              (val) => !!val || $gettext('* Required'),
              (val) =>
                val.length >= MIN_PASSWORD_LEN ||
                $gettextInterpolate(
                  $gettext('Please use minimum %{n} characters'),
                  {
                    n: MIN_PASSWORD_LEN,
                  },
                ),
            ]"
            :type="showpassword ? 'text' : 'password'"
          >
            <template #label>
              <translate>password</translate>
            </template>

            <template #prepend>
              <q-icon name="mdi-lock" />
            </template>

            <template #append>
              <q-icon
                :name="showpassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click="showpassword = !showpassword"
              />
            </template>
          </q-input>

          <div>
            <q-btn
              class="full-width"
              type="submit"
              color="primary"
              :loading="loading"
              :disabled="!isValid"
            >
              <translate>Log In</translate>
            </q-btn>
          </div>
        </q-form>

        <q-toolbar class="q-pa-md">
          <q-btn-dropdown ref="changeLanguage" flat stretch>
            <template #label>
              <q-icon name="mdi-earth" />
              <q-tooltip>
                <translate>Change App Language</translate>
              </q-tooltip>
            </template>
            <q-list>
              <q-item
                v-for="(language, key) in $language.available"
                :key="key"
                :active="key === $language.current"
                clickable
                @click="changeAppLanguage(key)"
              >
                {{ language }}
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-space />

          <ToggleDarkMode />
        </q-toolbar>
      </q-card-section>
    </q-card>
    <q-card
      flat
      :color="$q.dark.isActive ? 'blue-grey-9' : 'green'"
      :style="$q.screen.lt.sm ? { width: '80%' } : { width: '50%' }"
    >
      <q-card-section>
        <div
          class="wrap"
          color="green"
          style="display: flex; flex-direction: column"
        >
          <div class="top">
            <div class="head">
              <img class="logo" src="../assets/brand.svg" alt="" />
            </div>
            <div class="desc">
              <translate>app.passport.desc</translate>
            </div>
          </div>

          <div class="-inner-content mobile-hide" style="margin-left: 10%">
            <div
              style="
                margin-top: 10px;
                font-weight: bolder;
                font-size: xxx-large;
              "
            >
              <translate>app.passport.intro-1</translate><br />
              <translate>app.passport.intro-2</translate>
            </div>
            <q-separator></q-separator>
            <div
              style="margin-top: 15px; font-weight: normal; font-size: medium"
            >
              <q-badge color="white" floating></q-badge>
              <translate>about.point.1</translate>
              <br />
              <q-badge color="white" floating></q-badge>
              <translate>about.point.2</translate>
              <br />
              <q-badge color="white" floating></q-badge>
              <translate>about.point.3</translate>
              <br />
              <q-badge color="white" floating></q-badge>
              <translate>about.point.4</translate>
              <br />
              <q-badge color="white" floating></q-badge>
              <translate>about.point.5</translate>
              <br />
              <q-badge color="white" floating></q-badge>
              <translate>about.point.6</translate>
              <br />
            </div>
            <q-separator></q-separator>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGettext } from 'vue3-gettext'
import { useMeta, useQuasar } from 'quasar'

import { useAuthStore } from 'stores/auth'
import { useUiStore } from 'stores/ui'
import { gettext } from 'boot/gettext'
import { MIN_PASSWORD_LEN } from 'config/app.conf'

import ToggleDarkMode from 'components/ui/ToggleDarkMode'

import { modelIcon } from 'composables/element'

export default {
  name: 'Login',
  components: { ToggleDarkMode },
  setup() {
    const $q = useQuasar()
    const { $gettext } = useGettext()
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const uiStore = useUiStore()

    useMeta({ title: $gettext('Log In') })

    const loading = ref(false)
    const showpassword = ref(false)
    const model = reactive({
      username: '',
      password: '',
      type: 0,
      captcha: '1234',
    })
    const changeLanguage = ref(null)

    const isValid = computed(() => {
      return model.username.trim() !== '' && model.password.length > 3
    })

    onMounted(async () => {})
    const login = async () => {
      loading.value = true
      authStore.reset()

      await authStore
        .login(model)
        .then(() => {
          if (route.params.nextUrl != null) {
            router.push(route.params.nextUrl)
          } else {
            router.push({ name: 'home' })
          }
        })
        .catch((error) => {
          uiStore.notifyError(error)
        })
        .finally(() => (loading.value = false))
    }

    const changeAppLanguage = (key) => {
      if (gettext.current !== key) {
        gettext.current = key
        $q.cookies.set('language', key)
      }
      changeLanguage.value.hide()
    }

    return {
      MIN_PASSWORD_LEN,
      loading,
      showpassword,
      model,
      changeLanguage,
      isValid,
      login,
      changeAppLanguage,
      modelIcon,
    }
  },
}
</script>

<style scoped>
#logo {
  width: 75px;
  height: 75px;
}
</style>
