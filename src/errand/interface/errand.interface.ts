export enum ErrandCategory {
    DELIVERY = "DELIVERY",
    SHOPPING = "SHOPPING",
    CLEANING = "CLEANING",
    REPAIR = "REPAIR",
    PROXY = "PROXY",
    PET = "PET",
    CAR_WASH = "CAR_WASH",
    ETC = "ETC",
}

export enum ErrandStatus {
    MATCHING = "MATCHING", // 모집중
    COMPLETED = "COMPLETED", // 완료
    IN_PROGRESS = "IN_PROGRESS", // 진행중
}