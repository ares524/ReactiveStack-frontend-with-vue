<script src="./menu.js"></script>

<template>
	<div className="vertical-center">
		<router-link v-if="isHome && loggedIn" to="/about">About</router-link>
		<router-link v-else-if="isAbout && loggedIn" to="/">Lorems</router-link>
		<span v-else></span>
	</div>
</template>