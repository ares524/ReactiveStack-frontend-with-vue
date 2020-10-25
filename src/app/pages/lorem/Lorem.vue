<style src="./lorem.css"></style>
<script src="./lorem.js"></script>

<template>
	<p v-if="notLoaded()">Loading...</p>
	<div v-else id="lorem-component">
		<div id="lorem-form">
			<form class="form">
				<table width="100%" cellSpacing="0" cellPadding="10">
					<tbody>
					<tr>
						<td width="60" class="editorRow"><label>Name:</label></td>
						<td>
							<input
								name="firstname"
								:value="store.draft.document.firstname"
								@input="onChange"
								class="editorField"
								type="text"
								:disabled="isDisabled('firstname')"
								@focus="onFocus('firstname')"
								@blur="onBlur('firstname')"
							/>
							&nbsp;
							<input
								name="lastname"
								:value="store.draft.document.lastname"
								@input="onChange"
								class="editorField"
								type="text"
								:disabled="isDisabled('lastname')"
								@focus="onFocus('lastname')"
								@blur="onBlur('lastname')"
							/>
						</td>
					</tr>
					<tr>
						<td class="editorRow"><label>E-mail:</label></td>
						<td>
							<input
								name="email"
								:value="store.draft.document.email"
								@input="onChange"
								class="editorField"
								type="text"
								:disabled="isDisabled('email')"
								@focus="onFocus('email')"
								@blur="onBlur('email')"
							/>
						</td>
					</tr>
					<tr>
						<td class="editorRow"><label>Species:</label></td>
						<td>
							<select
								name="species"
								:value="store.draft.document.species"
								@change="onChange"
								class="editorField"
								:disabled="isDisabled('species')"
								@focus="onFocus('species')"
								@blur="onBlur('species')">
								<option v-for="option in SPECIES" v-bind:value="option" :key="option">
									{{ option }}
								</option>
							</select>
						</td>
					</tr>
					<tr>
						<td class="editorRow"><label>Rating:</label></td>
						<td>
							<input
								name="rating"
								:value="store.draft.document.rating"
								@input="onChange"
								class="editorField"
								type="number"
								:disabled="isDisabled('rating')"
								@focus="onFocus('rating')"
								@blur="onBlur('rating')"
							/>
						</td>
					</tr>
					<tr>
						<td class="editorRow"><label>Description:</label></td>
						<td>
							<textarea
								name="description"
								:value="store.draft.document.description"
								@input="onChange"
								style="width: 413px; height: 150px"
								:disabled="isDisabled('description')"
								@focus="onFocus('description')"
								@blur="onBlur('description')"
							/>
						</td>
					</tr>
					</tbody>
				</table>
			</form>
		</div>

		<div id="lorem-meta">
			<p>
				Draft created on
				<b>{{ momentDate(store.draft.document.createdAt) }}</b> using
				<b>version {{ store.draft.document.iteration }}</b> of <b>{{ store.draft.document.username }}</b>.
				<span v-show="store.draft.updatedAt"><br/>Last update at <b>{{ momentDate(store.draft.updatedAt) }}</b>.</span>
			</p>
		</div>

		<div id="lorem-controls">
			<button @click="closeDialog()">Close</button>
			&nbsp;&nbsp;
			<button @click="saveLorem()">Save</button>
		</div>
	</div>

</template>
