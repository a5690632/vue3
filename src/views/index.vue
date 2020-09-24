<template>
	<Layout>
		<a-table :columns="columns" :data-source="data">
			<template v-slot:tags="{ text: tags }">
				<span>
					<a-tag
						v-for="tag in tags"
						:key="tag"
						:color="
							tag === 'loser'
								? 'volcano'
								: tag.length > 5
								? 'geekblue'
								: 'green'
						"
						>{{ tag.toUpperCase() }}</a-tag
					>
				</span>
			</template>
			<template v-slot:action="{ record }">
				<span>
					<a>Invite 一 {{ record.name }}</a>
					<a-divider type="vertical" />
					<a>Delete</a>
					<a-divider type="vertical" />
					<a class="ant-dropdown-link">
						More actions
						<down-outlined />
					</a>
				</span>
			</template>
		</a-table>
	</Layout>
</template>

<script>
	import Layout from "../components/layout/index";
	export default {
		components: {
			Layout,
		},
		setup() {
			const columns = [
				{
					dataIndex: "name",
					key: "name",
					slots: {
						title: "customTitle",
						customRender: "name",
					},
				},
				{
					title: "Age",
					dataIndex: "age",
					key: "age",
				},
				{
					title: "Address",
					dataIndex: "address",
					key: "address",
				},
				{
					title: "Tags",
					key: "tags",
					dataIndex: "tags",
					slots: {
						customRender: "tags",
					},
				},
				{
					title: "Action",
					key: "action",
					slots: {
						customRender: "action",
					},
				},
			];
			let data = [];
			const getTableData = async () => {};
			getTableData();
			return {
				data: data,
				columns: columns,
			};
		},
	};
</script>

<style lang="scss" scoped>
</style>
