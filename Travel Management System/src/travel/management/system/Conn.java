package travel.management.system;

import java.sql.*;

public class Conn {
    Connection c;
    Statement s;

    public Conn() {
        try {
            // Load MySQL JDBC Driver
              Class.forName("com.mysql.cj.jdbc.Driver");

            // Establish the connection to the database
            c = DriverManager.getConnection("jdbc:mysql://localhost:3306/tms", "root", "EMMARESCUE");

            // Create the SQL statement
            s = c.createStatement();

        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.getMessage());
            e.printStackTrace();  // More details for debugging

        } catch (ClassNotFoundException e) {
            System.out.println("MySQL JDBC Driver not found: " + e.getMessage());
            e.printStackTrace();  // More details for debugging

        } catch (Exception e) {
            System.out.println("General Exception: " + e.getMessage());
            e.printStackTrace();  // More details for debugging
        }
    }
}
