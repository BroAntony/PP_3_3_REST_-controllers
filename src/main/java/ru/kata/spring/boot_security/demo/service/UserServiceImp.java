package ru.kata.spring.boot_security.demo.service;

import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.dao.UserDao;
import ru.kata.spring.boot_security.demo.dto.RoleDTO;
import ru.kata.spring.boot_security.demo.dto.UserDTO;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.RoleUser;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@Transactional
@Service
public class UserServiceImp implements UserService {

    private UserDao userDao;
    private PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    @Autowired
    public UserServiceImp(UserDao userDao, PasswordEncoder passwordEncoder,RoleService roleService) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
    }

    @Override
    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }

    @Override
    public void addUser(User user) {
        Set<Role> roleSet = new HashSet<>();
        if (user.getRoles() != null) {
            for (Role roleUser : user.getRoles()) {
                Optional<Role> role = roleService.findRoleByName(roleUser.getRoleName());
                role.ifPresent(roleSet::add);
            }
        } else {
            Optional<Role> role = roleService.findRoleByName("USER");
            role.ifPresent(roleSet::add);
        }
        user.setRoles(roleSet);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.addUser(user);
    }
    @Override
    public User findUserById (int id) {
        return userDao.findUserById(id);
    }
    @Override
    public void deleteUser(int id) {
        userDao.deleteUser(id);
    }

    @Override
    public void updateUser(User user) {
        if (user.getRoles() != null) {
            Set<Role> roles = user.getRoles();
            Set<Role> newRoles = new HashSet<>();
            for (Role role : roles) {
                roleService.findRoleByName(role.getRoleName()).ifPresent(newRoles::add);
            }
            user.setRoles(newRoles);
        } else {
            Set<Role> roleSet = new HashSet<>();
            Optional<Role> role = roleService.findRoleByName("USER");
            role.ifPresent(roleSet::add);
            user.setRoles(roleSet);
        }
        if(user.getPassword().isEmpty()) {
            user.setPassword(userDao.findUserById(user.getId()).getPassword());
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userDao.updateUser(user);
    }
    @Override
    public void deleteAllUsers() {
        userDao.deleteAllUsers();
    }

    public UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setAge(user.getAge());
        userDTO.setEmail(user.getEmail());
        userDTO.setPassword(user.getPassword());
        userDTO.setRoles(user.getRoles().stream().map(this::convertToDTO).collect(Collectors.toSet()));
        return userDTO;
    }

    public User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setAge(userDTO.getAge());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setRoles(userDTO.getRoles().stream().map(this::convertToEntity).collect(Collectors.toSet()));
        return user;
    }

    public RoleDTO convertToDTO(Role role) {
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setRoleName(role.getRoleName());
        return roleDTO;
    }

    public Role convertToEntity(RoleDTO roleDTO) {
        Role role = new Role();
        role.setRoleUser(RoleUser.valueOf(roleDTO.getRoleName()));
        return role;
    }
}
