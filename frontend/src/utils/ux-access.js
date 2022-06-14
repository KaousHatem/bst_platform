



const ROLES_LIST={
	ADMIN: '1',
  	LOGISTIC_ADMIN: '2',
  	STOCK_MANAGER: '3',
}

class UXAccess {


	hasUserAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasProductAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN,ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasCategoryAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN,ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasProvisionApproveAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN,ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasProvisionRejectAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN,ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasAllLocationAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN,ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasPurchaseRequestApproveAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasRefPRinPO = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.ADMIN,ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}



}

export default new UXAccess();