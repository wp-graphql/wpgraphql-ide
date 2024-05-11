const actions = {
	registerButton: ( name, component ) => ( {
		type: 'REGISTER_BUTTON',
		name,
		component,
	} ),
};

export default actions;
