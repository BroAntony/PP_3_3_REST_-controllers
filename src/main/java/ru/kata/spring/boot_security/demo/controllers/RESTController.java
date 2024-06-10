package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.dto.RoleDTO;
import ru.kata.spring.boot_security.demo.dto.UserDTO;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class RESTController {
    private final UserService userService;


    @Autowired
    public RESTController(UserService userService, RoleService roleService) {
        this.userService = userService;
    }

    @GetMapping()
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ((User) auth.getPrincipal());
    }

    @GetMapping("/users")
    public List<User> getAllUser() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody UserDTO updatedUserDTO) {

        User existingUser = userService.findUserById(id);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }

        User updatedUser = userService.convertToEntity(updatedUserDTO);
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setAge(updatedUser.getAge());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRoles(updatedUser.getRoles());
        userService.updateUser(existingUser);

        return ResponseEntity.ok(userService.convertToDTO(existingUser));
    }

    @PostMapping("/users")
    public ResponseEntity<?> addUser(@RequestBody UserDTO newUserDTO) {
        User newUser = userService.convertToEntity(newUserDTO);
        userService.addUser(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.convertToDTO(newUser));
        //return ResponseEntity.ok(userService.convertToDTO(newUser));
    }
}
