<script src="./controls.js"></script>

<template>
	<div id="lorems-controls">
		Page <b>{{ page }}</b> of <b>{{ pageCount }}</b>
		&nbsp;
		<button :disabled="page <= 1" @click="pageDec()">-</button>
		&nbsp;
		<button :disabled="page >= pageCount" @click="pageInc()">+</button>
		&nbsp;|&nbsp;
		Page size <b>{{ pageSize }}</b>
		&nbsp;
		<button :disabled="pageSize <= MIN_PAGE_SIZE" @click="pageSizeDec()">-</button>
		&nbsp;
		<button :disabled="pageSize >= MAX_PAGE_SIZE" @click="pageSizeInc()">+</button>
		&nbsp;|&nbsp;
		<input type="text" name="search" v-model.trim="search"/>
		&nbsp;
		<button :disabled="search===''" @click="resetSearch()">x</button>
	</div>
</template>
