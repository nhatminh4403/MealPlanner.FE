enum MealType {
    Breakfast = 0,
    Lunch = 1,
    Dinner = 2,
    Snack = 3
}

enum DifficultyLevel {
    Easy = 0,
    Medium = 1,
    Hard = 2
}

enum VisibilityLevel {
    Private = 0,
    FriendsOnly = 1,
    Public = 2
}
enum NotificationType {
    RecipeShared = 0,
    MealReminder = 1,
    RecipeLiked = 2,
    RecipeCommented = 3,
    ShoppingListAlert = 4
}
enum ShoppingListCategory {
    Produce = 0,
    Meat = 1,
    Dairy = 2,
    Pantry = 3,
    Frozen = 4,
    Other = 5
}
enum DayOfWeek {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}

export {
    MealType,
    DifficultyLevel,
    VisibilityLevel,
    ShoppingListCategory,
    DayOfWeek,
    NotificationType
};