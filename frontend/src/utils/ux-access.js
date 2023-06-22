



const ROLES_LIST = {
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
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasCategoryAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasProvisionApproveAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasProvisionRejectAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasAllLocationAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasPurchaseRequestApproveAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasRefPRinPO = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasAccessToPrice = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasPOupdateAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)

	}

	hasPOAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)
	}

	hasSupplierAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)
	}

	hasStoreAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)
	}

	hasProformaRequest = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)
	}

	hasProformaInvoice = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')

		return ROLES_ACCESS.includes(role)
	}


	hasTransferReceiveAccess = (userLocation, targetLocation) => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const ROLES_ACCESS_CONDITIONNAL = [ROLES_LIST.STOCK_MANAGER]
		const role = localStorage.getItem('role')
		if (ROLES_ACCESS.includes(role)) {
			return true
		} else if (ROLES_ACCESS_CONDITIONNAL.includes(role)) {
			return userLocation === targetLocation
		}
		return false
	}

	hasStockInDocumentAccess = () => {
		const ROLES_ACCESS = [ROLES_LIST.STOCK_MANAGER]
		const role = localStorage.getItem('role')
		console.log(role)

		return ROLES_ACCESS.includes(role)
	}

	hasAccessDeleteAttachedFile = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')
		console.log(role)

		return ROLES_ACCESS.includes(role)
	}

	hasAccessAllStockInDocument = () => {
		const ROLES_ACCESS = [ROLES_LIST.ADMIN, ROLES_LIST.LOGISTIC_ADMIN]
		const role = localStorage.getItem('role')
		console.log(role)

		return ROLES_ACCESS.includes(role)
	}




}

export default new UXAccess();