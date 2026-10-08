package com.assistify.backend;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "test123!";

        System.out.println("BCrypt Hash:");
        System.out.println(encoder.encode(password));
    }
}