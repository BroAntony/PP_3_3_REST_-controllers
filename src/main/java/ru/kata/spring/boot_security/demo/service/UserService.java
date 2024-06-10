package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.dto.RoleDTO;
import ru.kata.spring.boot_security.demo.dto.UserDTO;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> getAllUsers();
    void addUser(User user);
    void deleteUser (int id);
    User findUserById (int id);
    void updateUser(User user);
    void deleteAllUsers();
    UserDTO convertToDTO(User user);
    User convertToEntity(UserDTO userDTO);
    RoleDTO convertToDTO(Role role);
    Role convertToEntity(RoleDTO roleDTO);

}
