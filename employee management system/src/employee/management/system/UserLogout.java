package employee.management.system;

public class UserLogout {

    // Constructor
    public UserLogout() {
        // Perform logout operations here
        handleLogout();
    }

    // Method to handle logout
    private void handleLogout() {
        // Example: Clear user session data
        clearUserSession();

        // Display a message indicating successful logout
        System.out.println("User has been logged out successfully.");

        // Exit the application
        System.exit(0);
    }

    // Method to clear user session data (placeholder)
    private void clearUserSession() {
        // Add logic to clear session or user data if applicable
        System.out.println("User session data cleared.");
    }

    public static void main(String[] args) {
        new UserLogout();
    }
}


