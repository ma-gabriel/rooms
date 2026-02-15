<template>
  <div class="auth-wrapper">
    <form class="auth-card" @submit.prevent="">
      <h2>Create Account</h2>
      <div class="form-group">
        <input 
          v-model="username" 
          placeholder="Username" 
          type="text" 
          required
        />
        <p v-if="validation.failing === 1" class="error">
          {{ validation.reason }}
        </p>
      </div>

      <div class="form-group">
        <input 
          v-model="password" 
          placeholder="Password" 
          type="password" 
          required
        />
        <p v-if="validation.failing === 2" class="error">
          {{ validation.reason }}
        </p>
      </div>

      <div class="form-group">
        <input 
          v-model="password_check" 
          placeholder="Confirm Password" 
          type="password" 
          required
        />
        <p v-if="validation.failing === 3" class="error">
          {{ validation.reason }}
        </p>
      </div>

      <button type="submit" class="submit-btn">
         {{validation.failing == 0 ? 'Sign-up' : '...' }}
      </button>

      <p class="switch-link">
        Already have an account?
        <RouterLink to="/login" replace>Login</RouterLink>
      </p>
    </form>
  </div>
</template>


<script setup lang="ts">

import { ref } from "vue";
const username = ref("");
const password = ref("");
const password_check = ref("");

import { computed } from "vue";

const validation = computed(() => {
  if (!username.value && !password.value && !password_check.value) {
    return { failing: -1, reason: '' }
  }
  if (username.value.length < 3) {
    return { failing: 1, reason: 'the username must be at least 3 chars long' }
  }
  if (password.value.length < 4) {
    return { failing: 2, reason: 'the password must be at least 4 chars long' }
  }
  if (password.value !== password_check.value) {
    return { failing: 3, reason: 'the two password must be the same' }
  }
  return { failing: 0, reason: '' }
})

</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.auth-card {
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #0f971c, #0c0c0c );
}

.auth-card h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

input {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  transition: 0.2s ease;
}

input:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.error {
  color: #e53e3e;
  border-radius: 4px;
  padding-right: 2px;
  padding-left: 2px;
  background-color: antiquewhite;
  font-weight: 900;
  font-size: 0.85rem;
  margin-top: 0.4rem;
  margin-bottom: -0.4rem;
}

.submit-btn {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  background: #667eea;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.submit-btn:hover {
  background: #5a67d8;
}

.switch-link {
  margin-top: 1.2rem;
  text-align: center;
  font-size: 0.9rem;
}
</style>
