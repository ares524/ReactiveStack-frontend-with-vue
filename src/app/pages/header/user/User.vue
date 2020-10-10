<style src="./user.css"></style>
<script src="./user.js"></script>

<template lang="html">
	<div v-if="notLoggedIn" id="user-component">
		<span class="FacebookButton" @click="facebook()">
			<i class="fa fa-facebook" style="font-size: 0.6rem;"></i>
			Login
		</span>
		&nbsp;
		<span class="GoogleButton" @click="google()">
			<i class="fa fa-google" style="font-size: 0.6rem;"></i>
			Login
		</span>
	</div>
	<span v-else>
		{{ provider }}_{{ providerId }} <router-link to="/logout" class="logout">logout</router-link>
	</span>
</template>
