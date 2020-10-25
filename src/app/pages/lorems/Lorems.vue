<style src="./lorems.css"></style>
<script src="./lorems.js"></script>

<template>
	<div id="lorems-component">
		<Controls @resend-config="resendConfig($event)"/>

		<div id="lorems-grid">
			<table width="100%" border="1" cellSpacing="0" cellPadding="10">
				<thead>
				<tr>
					<th align="left">#</th>
					<th align="left" @click="toggleSorting('iteration')">
						V. <i :class="getIcon('iteration')"/>
					</th>
					<th align="left" @click="toggleSorting('firstname')">
						Name <i :class="getIcon('firstname')"/>
					</th>
					<th align="left" @click="toggleSorting('username')">
						Username <i :class="getIcon('username')"/>
					</th>
					<th align="left" @click="toggleSorting('email')">
						Email <i :class="getIcon('email')"/>
					</th>
					<th align="left" @click="toggleSorting('rating')">
						Rating <i :class="getIcon('rating')"/>
					</th>
					<th align="left" @click="toggleSorting('species')">
						Species <i :class="getIcon('species')"/>
					</th>
					<th align="left" @click="toggleSorting('description')">
						Description <i :class="getIcon('description')"/>
					</th>
					<th align="left" @click="toggleSorting('createdAt')">
						Created At <i :class="getIcon('createdAt')"/>
					</th>
				</tr>
				</thead>

				<tbody>
				<tr v-for="(lorem, index) in store.lorems" @click="selectRow(lorem)" :class="getRowClass(lorem)" :key="index">
					<td>{{ ((this.page - 1) * this.pageSize) + index + 1 }}</td>
					<td>{{ lorem.iteration }}</td>
					<td>{{ lorem.firstname }} {{ lorem.lastname }}</td>
					<td>{{ lorem.username }}</td>
					<td>{{ lorem.email }}</td>
					<td>{{ lorem.rating }}</td>
					<td>{{ lorem.species }}</td>
					<td>
						{{ truncate(lorem.description) }}
					</td>
					<td>{{ momentDate(lorem.createdAt) }}</td>
				</tr>
				</tbody>
			</table>
		</div>

		<Preview v-show="hasSelected()"/>
	</div>
</template>
