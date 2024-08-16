
const enums = {
    "ProductionStatus": [
        {
            severity: "warning",
            class: "p-button-info",
            icon: "pi pi-fw pi-clock",
            name: "NoInfo",
            value: "NoInfo"
        },
        {
            severity: "danger",
            class: "p-button-info",
            icon: "pi pi-fw pi-clock",
            name: "WaitingForSkeleton",
            value: "WaitingForSkeleton"
        },
        {
            severity: "info",
            class: "p-button-success",
            icon: "pi pi-fw pi-check-circle",
            name: "SkeletonReady",
            value: "SkeletonReady"
        },
        {
            severity: "danger",
            class: "p-button-info",
            icon: "pi pi-fw pi-clock",
            name: "WaitingForFabric",
            value: "WaitingForFabric"
        },
        {
            severity: "info",
            class: "p-button-success",
            icon: "pi pi-fw pi-check-circle",
            name: "FabricReady",
            value: "FabricReady"
        },
        {
            severity: "warning",
            class: "p-button-warning",
            icon: "pi pi-fw pi-scissors",
            name: "FabricCutting",
            value: "FabricCutting"
        },
        {
            severity: "warning",
            class: "p-button-warning",
            icon: "pi pi-fw pi-pen",
            name: "FabricSewing",
            value: "FabricSewing"
        },
        {
            severity: "info",
            class: "p-button-info",
            icon: "pi pi-fw pi-truck",
            name: "SentToCapitone",
            value: "SentToCapitone"
        },
        {
            severity: "info",
            class: "p-button-info",
            icon: "pi pi-fw pi-truck",
            name: "ReceivedFromCapitone",
            value: "ReceivedFromCapitone"
        },
        {
            severity: "primary",
            class: "p-button-primary",
            icon: "pi pi-fw pi-cog",
            name: "SentToProduction",
            value: "SentToProduction"
        },
        {
            severity: "info",
            class: "p-button-success",
            icon: "pi pi-fw pi-check-circle",
            name: "Produced",
            value: "Produced"
        },
        {
            severity: "secondary",
            class: "p-button-secondary",
            icon: "pi pi-fw pi-box",
            name: "Packaged",
            value: "Packaged"
        },
        {
            severity: "secondary",
            class: "p-button-secondary",
            icon: "pi pi-fw pi-home",
            name: "InWarehouse",
            value: "InWarehouse"
        },
        {
            severity: "success",
            class: "p-button-success",
            icon: "pi pi-fw pi-check",
            name: "Completed",
            value: "Completed"
        }
    ],
    "SmsProvider": [
        {
            "name": "Mutlucell",
            "value": "Mutlucell"
        },
        {
            "name": "NetGsm",
            "value": "NetGsm"
        }
    ],
    "EntityCategory": [
        {
            "name": "Personal",
            "value": "Personal"
        },
        {
            "name": "Corporate",
            "value": "Corporate"
        }
    ],
    "ServiceType": [
        {
            icon: "pi pi-truck",
            severity: "success",
            "name": "Transportation",
            "value": "Transportation"
        },
        {
            icon: "pi pi-cog",
            severity: "warning",
            "name": "Installation",
            "value": "Installation"
        },
        {
            severity: "danger",
            "name": "Maintenance",
            "value": "Maintenance"
        },
        {
            severity: "info",
            "name": "Other",
            "value": "Other"
        }
    ],
    "PriceChangeType": [

        {
            "name": "Up",
            "value": "Up"
        },
        {
            "name": "Down",
            "value": "Down"
        }
    ],
    "PriceChangeWay": [

        {
            "name": "Percentage",
            "value": "Percentage"
        },
        {
            "name": "Amount",
            "value": "Amount"
        }
    ],
    "CashTransactionType": [
        {
            icon: "pi pi-arrow-circle-down",
            severity: "success",
            "name": "Deposit",
            "value": "Deposit"
        },
        {
            icon: "pi pi-arrow-circle-up",
            severity: "danger",
            "name": "Withdrawal",
            "value": "Withdrawal"
        },
        {
            icon: "pi pi-arrow-right-arrow-left",
            severity: "info",
            "name": "Transfer",
            "value": "Transfer"
        }
    ],
    "CurrencyType": [
        {
            "name": "TRY",
            "value": "TRY"
        },
        {
            "name": "USD",
            "value": "USD"
        },
        {
            "name": "EUR",
            "value": "EUR"
        },
        {
            "name": "GBP",
            "value": "GBP"
        }
    ],
    "CustomerOrderStatus": [
        {
            severity: "warning",
            "class": "p-button-success",
            "icon": "pi pi-fw pi-clock",
            "name": "Pending",
            "value": "Pending"
        },
        {
            severity: "secondary",
            "icon": "pi pi-fw pi-shopping-cart",
            "name": "Ordered",
            "value": "Ordered"
        },
        {
            severity: "info",
            "icon": "pi pi-fw pi-cog",
            "name": "Preparing",
            "value": "Preparing"
        },
        {
            severity: "primary",
            "icon": "pi pi-fw pi-box",
            "name": "Depot",
            "value": "Depot"
        },
        {
            severity: "warning",
            "icon": "pi pi-fw pi-truck",
            "name": "Transporting",
            "value": "Transporting"
        },
        {
            severity: "success",
            "icon": "pi pi-fw pi-check-circle",
            "name": "Completed",
            "value": "Completed"
        },
        {
            severity: "danger",
            "icon": "pi pi-fw pi-thumbs-down",
            "name": "Refund",
            "value": "Refund"
        },
        {
            severity: "danger",
            "icon": "pi pi-fw pi-times-circle",
            "name": "Canceled",
            "value": "Canceled"
        },
    ],
    "FinancialAccountType": [
        {
            severity: "warning",
            "name": "Customer",
            "value": "Customer"
        },
        {
            severity: "success",
            "name": "Supplier",
            "value": "Supplier"
        },
        {
            severity: "info",
            "name": "Transporter",
            "value": "Transporter"
        },
        {
            severity: "primary",
            "name": "Textile",
            "value": "Textile"
        },
        {
            severity: "primary",
            "name": "Other",
            "value": "Other"
        }
    ],
    "FinancialItemType": [
        {
            severity: "danger",
            "name": "Expense",
            "value": "Expense"
        },
        {

            severity: "success",
            "name": "Revenue",
            "value": "Revenue"
        }
    ],
    "FinancialTransactionType": [
        {
            severity: "danger",
            "name": "Debit",
            "value": "Debit"
        },
        {
            severity: "success",
            "name": "Credit",
            "value": "Credit"
        }
    ],
    "NotificationWay": [
        {
            severity: "warning",
            "name": "Mail",
            "value": "Mail"
        },
        {
            severity: "success",
            "name": "Sms",
            "value": "Sms"
        }
    ],
    "OfferStatus": [

        {
            severity: "warning",
            "icon": "pi pi-fw pi-hourglass",
            "name": "Draft",
            "value": "Draft"
        },
        {
            severity: "warning",
            "icon": "pi pi-fw pi-clock",
            "name": "WaitingToCustomer",
            "value": "WaitingToCustomer"
        },
        {
            severity: "success",
            "icon": "pi pi-fw pi-check-circle",
            "name": "Accepted",
            "value": "Accepted"
        },
        {
            severity: "primary",
            "icon": "pi pi-fw pi-cog",
            "name": "CustomerWaitingForNewOffer",
            "value": "CustomerWaitingForNewOffer"
        },
        {
            severity: "danger",
            "icon": "pi pi-fw pi-thumbs-down",
            "name": "Rejected",
            "value": "Rejected"
        },
        {
            severity: "info",
            "icon": "pi pi-fw pi-shopping-cart",
            "name": "Confirmed",
            "value": "Confirmed"
        }
    ],
    "PageType": [
        {
            "name": "ProductView",
            "value": "ProductView"
        },
        {
            "name": "OfferView",
            "value": "OfferView"
        },
        {
            "name": "OrderView",
            "value": "OrderView"
        },
        {
            "name": "OrderEdit",
            "value": "OrderEdit"
        },
        {
            "name": "OrderPriceView",
            "value": "OrderPriceView"
        },
        {
            "name": "OrderStatusChange",
            "value": "OrderStatusChange"
        },
        {
            "name": "OtherUsersOrdersView",
            "value": "OtherUsersOrdersView"
        },
        {
            "name": "FinancialItemManagement",
            "value": "FinancialItemManagement"
        },
        {
            "name": "FinancialItemReportView",
            "value": "FinancialItemReportView"
        },
        {
            "name": "CashAccountView",
            "value": "CashAccountView"
        },
        {
            "name": "CashAccountEdit",
            "value": "CashAccountEdit"
        },
        {
            "name": "CashAccountStatementView",
            "value": "CashAccountStatementView"
        },
        {
            "name": "CashTransactionView",
            "value": "CashTransactionView"
        },
        {
            "name": "CashTransactionEdit",
            "value": "CashTransactionEdit"
        },
        {
            "name": "FinancialTransactionView",
            "value": "FinancialTransactionView"
        },
        {
            "name": "FinancialTransactionEdit",
            "value": "FinancialTransactionEdit"
        },
        {
            "name": "FinancialAccountView",
            "value": "FinancialAccountView"
        },
        {
            "name": "FinancialAccountBalanceView",
            "value": "FinancialAccountBalanceView"
        },
        {
            "name": "FinancialAccountEdit",
            "value": "FinancialAccountEdit"
        },
        {
            "name": "FinancialAccountStatementView",
            "value": "FinancialAccountStatementView"
        },
        {
            "name": "CompanySettingsManagement",
            "value": "CompanySettingsManagement"
        },
        {
            "name": "UserView",
            "value": "UserView"
        },
        {
            "name": "UserEdit",
            "value": "UserEdit"
        },
        {
            "name": "RoleManagement",
            "value": "RoleManagement"
        },
        {
            "name": "SmsEmailView",
            "value": "SmsEmailView"
        }
    ],
    "ProductStatus": [
        {
            severity: "success",
            "name": "Active",
            "value": "Active"
        },
        {
            severity: "danger",
            "name": "Passive",
            "value": "Passive"
        }
    ],
    "RecurrencePattern": [
        {
            "name": "None",
            "value": "None"
        },
        {
            "name": "Monthly",
            "value": "Monthly"
        },
        {
            "name": "Quarterly",
            "value": "Quarterly"
        },
        {
            "name": "Semiannually",
            "value": "Semiannually"
        },
        {
            "name": "Annually",
            "value": "Annually"
        }
    ],
    "SubscriptionType": [
        {
            "name": "None",
            "value": "None"
        },
        {
            "name": "OnlyIntegration",
            "value": "OnlyIntegration"
        },
        {
            "name": "IntegrationAndSelling",
            "value": "IntegrationAndSelling"
        },
        {
            "name": "All",
            "value": "All"
        }
    ],

    "TaskPlanStatus": [
        {
            severity: "danger",
            "value": "NotStarted"
        },
        {
            severity: "info",
            "name": "InProgress",
            "value": "InProgress"
        },
        {
            severity: "success",
            "name": "Completed",
            "value": "Completed"
        }
    ],
    "UserType": [

        {
            severity: "success",
            "name": "CompanyManager",
            "value": "CompanyManager"
        },
        {
            severity: "info",
            "name": "SalesConsultant",
            "value": "SalesConsultant"
        },
        {
            severity: "warning",
            "name": "ProductUnit",
            "value": "ProductUnit"
        },
        {
            severity: "warning",
            "name": "SupportUser",
            "value": "SupportUser"
        },
        {
            severity: "warning",
            "name": "ShipmentUser",
            "value": "ShipmentUser"
        },
        {
            severity: "warning",
            "name": "AccountingUser",
            "value": "AccountingUser"
        }
    ]
}

export default enums;