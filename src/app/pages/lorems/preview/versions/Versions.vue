<script src="./versions.js"></script>

<template>
	<div id="lorems-preview-grid">
		<table width="100%" border="1" cellSpacing="0" cellPadding="10">
			<thead>
			<tr>
				<th>V.</th>
				<th>Rating</th>
				<th>Created At</th>
			</tr>
			</thead>

			<tbody>
			<tr v-for="(lorem, index) in getVersions()" @click="selectRow(lorem)" :class="getRowClass(lorem)" :key="index">
				<td>{{ lorem.iteration }}</td>
				<td>{{ lorem.rating }}</td>
				<td>{{ momentDate(lorem.createdAt) }}</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>
