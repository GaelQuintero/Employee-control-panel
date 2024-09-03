import "./App.css";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import {
  IconButton,
  Wrap,
  Avatar,
  WrapItem,
  Text,
  Box,
  ChakraProvider,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Flex,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Center,
  Tooltip,
  Stack,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, SettingsIcon } from "@chakra-ui/icons";
import { Input, FormControl } from "@chakra-ui/react";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [charge, setCharge] = useState("");
  const [years, setYears] = useState("");
  const [image, setImage] = useState(null); // Estado para la imagen
  const [employeesList, setEmployeesList] = useState([]);
  const [employeeId, setEmployeeId] = useState([]);
  const [employeeName, setEmployeeName] = useState([]);
  const [employeeAge, setEmployeeAge] = useState([]);
  const [employeeCity, setEmployeeCity] = useState([]);
  const [employeeCharge, setEmployeeCharge] = useState([]);
  const [employeeYears, setEmployeeYears] = useState([]);
  const [employeeImage, setEmployeeImage] = useState(null);
  const [employeeImageDelete, setEmployeeImageDelete] = useState([]);
  const [deleteId, setDeleteId] = useState(null); // Para almacenar el ID del registro a eliminar
  const [updateId, setUpdateId] = useState(null); // Para almacenar el ID del registro a actualizar

  // Hooks para modales
  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateModalClose,
  } = useDisclosure();
  const {
    isOpen: isDrawer,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const btnRef = useRef();
  const cancelRef = useRef();

  const handleSubmit = async () => {
    if (!name || !city || !charge || age <= 0 || years < 0) {
      Swal.fire({
        title: "Error",
        text: "Please fill out all fields correctly.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("city", city);
    formData.append("charge", charge);
    formData.append("years", years);
    if (image) {
      formData.append("image", image); // Añadir la imagen al FormData
    }

    try {
      const response = await Axios.post(
        "http://localhost:3001/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Fetch the updated list of employees
        getEmployees();

        // Reset form fields
        setName("");
        setAge("");
        setCity("");
        setCharge("");
        setYears("");
        setImage(null); // Reset image

        // Close the modal
        onAddModalClose();
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to register user. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error during user registration:", error);
    }
  };
  //Logica para actualizar los datos de los empleados
  const handleSubmitUpdate = async () => {
    if (
      !employeeId ||
      !employeeName ||
      !employeeCity ||
      !employeeCharge ||
      employeeAge <= 0 ||
      employeeYears < 0 ||
      !employeeImage
    ) {
      Swal.fire({
        title: "Error",
        text: "Please fill out all fields correctly.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("idEmployee", employeeId);
    formData.append("name", employeeName);
    formData.append("age", employeeAge);
    formData.append("city", employeeCity);
    formData.append("charge", employeeCharge);
    formData.append("years", employeeYears);
    if (employeeImage) {
      formData.append("image", employeeImage); // Asegúrate de usar 'image' si es el archivo actualizado
    }

    try {
      const response = await Axios.post(
        `http://localhost:3001/update/${employeeId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Fetch the updated list of employees
        getEmployees();

        // Reset form fields
        setEmployeeName("");
        setEmployeeAge("");
        setEmployeeCity("");
        setEmployeeCharge("");
        setEmployeeYears("");
        setImage(null); // Reset image

        // Close the modal
        onUpdateModalClose();
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update user. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error during user update:", error);
    }
  };

  //Logica para imprimir los datos de los empleados desde la base de datos
  const getEmployees = async () => {
    try {
      const response = await Axios.get("http://localhost:3001/employees");
      setEmployeesList(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch employees. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const deleteEmployees = async () => {
    if (deleteId === null) return;

    try {
      const response = await Axios.delete(
        `http://localhost:3001/delete/${deleteId}`
      );

      if (response.data.success) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Refrescar la lista de empleados después de la eliminación
        getEmployees();
        onDeleteModalClose();
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to delete employee. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error during employee deletion:", error);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <ChakraProvider>
      <div className="App">
        <Box boxShadow="lg" bg="#0563c9" w="100%" p={4} color="white">
          <Flex align="center" justify="space-between">
            <Text fontSize="2xl">Employee control panel</Text>
            <Flex>
              <Tooltip
                label="Add new Employee"
                placement="left-start"
                fontSize="sm"
              >
                <IconButton
                  isRound={true}
                  onClick={onAddModalOpen}
                  color="#0563c9"
                  size="sm"
                  mr={4} // Margen derecho para separar de otro botón
                >
                  <AddIcon colorScheme="blue" />
                </IconButton>
              </Tooltip>
              <IconButton
                isRound={true}
                ref={btnRef}
                onClick={onDrawerOpen}
                color="#0563c9"
                size="sm"
              >
                <SettingsIcon colorScheme="blue" />
              </IconButton>
            </Flex>
          </Flex>
          <Drawer
            isOpen={isDrawer}
            placement="right"
            onClose={onDrawerClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Create your account</DrawerHeader>

              <DrawerBody>
               <Center> <Text fontSize='20px' color='#0563c9'>Featured employees</Text></Center>
               <br/>
                <Stack direction="row">
                  {employeesList.map((employee, index) => (
                    <div key={index}>
                      {employee.image ? (
                        <Avatar
                          size="md"
                          name={employee.name}
                          src={`http://localhost:3001/image/${employee.idEmployee}`}
                          alt="Employee"
                        />
                      ) : (
                        "No image"
                      )}
                    </div>
                  ))}
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>

        {/* Add Employee Modal */}
        <Modal isOpen={isAddModalOpen} onClose={onAddModalClose}>
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent position="relative">
            <ModalHeader>Add New Employee</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <Input
                  placeholder="Name"
                  variant="flushed"
                  size="sm"
                  onChange={(event) => setName(event.target.value)}
                  type="text"
                  value={name}
                />
                <Input
                  placeholder="Age"
                  variant="flushed"
                  size="sm"
                  onChange={(event) =>
                    setAge(
                      event.target.value === ""
                        ? ""
                        : parseInt(event.target.value)
                    )
                  }
                  type="number"
                  value={age}
                  min={1}
                />
                <Input
                  placeholder="City"
                  variant="flushed"
                  size="sm"
                  onChange={(event) => setCity(event.target.value)}
                  type="text"
                  value={city}
                />
                <Input
                  placeholder="Charge"
                  variant="flushed"
                  size="sm"
                  onChange={(event) => setCharge(event.target.value)}
                  type="text"
                  value={charge}
                />
                <Input
                  placeholder="Years"
                  variant="flushed"
                  size="sm"
                  onChange={(event) =>
                    setYears(parseInt(event.target.value, 10) || 0)
                  }
                  type="number"
                  value={years}
                />
                <Input
                  type="file"
                  size="sm"
                  variant="flushed"
                  accept="image/jpeg,image/jpg"
                  onChange={(event) => setImage(event.target.files[0])}
                  mt={4}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Save
              </Button>
              <Button variant="ghost" onClick={onAddModalClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/*Update Employee Modal */}
        <Modal isOpen={isUpdateModalOpen} onClose={onUpdateModalClose}>
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent position="relative">
            <ModalHeader>
              Update Data for{" "}
              <Text as="span" color="#0563c9">
                {employeeName}
              </Text>{" "}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <Input
                  hidden
                  placeholder="ID"
                  variant="flushed"
                  size="sm"
                  onChange={(event) => setEmployeeId(event.target.value)}
                  type="text"
                  value={employeeId}
                />

                <Input
                  placeholder="Name"
                  variant="flushed"
                  size="sm"
                  onChange={(event) => setEmployeeName(event.target.value)}
                  type="text"
                  value={employeeName}
                />

                <Input
                  placeholder="Age"
                  variant="flushed"
                  size="sm"
                  onChange={(event) =>
                    setEmployeeAge(
                      event.target.value === ""
                        ? ""
                        : parseInt(event.target.value)
                    )
                  }
                  type="number"
                  value={employeeAge}
                  min={1}
                />
                <Input
                  placeholder="City"
                  variant="flushed"
                  size="sm"
                  onChange={(event) => setEmployeeCity(event.target.value)}
                  type="text"
                  value={employeeCity}
                />
                <Input
                  placeholder="Charge"
                  variant="flushed"
                  size="sm"
                  onChange={(event) => setEmployeeCharge(event.target.value)}
                  type="text"
                  value={employeeCharge}
                />
                <Input
                  placeholder="Years"
                  variant="flushed"
                  size="sm"
                  onChange={(event) =>
                    setEmployeeYears(parseInt(event.target.value, 10) || 0)
                  }
                  type="number"
                  value={employeeYears}
                />
                <Input
                  type="file"
                  size="sm"
                  variant="flushed"
                  accept="image/jpeg,image/jpg"
                  onChange={(event) => setEmployeeImage(event.target.files[0])}
                  mt={4}
                />
              </FormControl>
            </ModalBody>
            <Center>
              <Wrap>
                <WrapItem>
                  {employeeImage ? (
                    <Avatar
                      size="2xl"
                      name={employeeName}
                      src={`http://localhost:3001/image/${employeeId}`}
                      alt="Employee"
                    />
                  ) : (
                    "No image"
                  )}
                </WrapItem>
              </Wrap>
            </Center>
            <br />
            <Center>
              <Text as="span" color="#0563c9">
                Current photography
              </Text>
            </Center>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmitUpdate}>
                Save
              </Button>
              <Button variant="ghost" onClick={onUpdateModalClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={onDeleteModalClose}
          isOpen={isDeleteModalOpen}
          isCentered
        >
          <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <AlertDialogContent>
            <AlertDialogHeader>
              You want to delete the employee{" "}
              <Text as="span" color="tomato">
                {employeeName}
              </Text>
              ?
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Center>
                <Wrap>
                  <WrapItem>
                    {employeeImageDelete ? (
                      <Avatar
                        size="2xl"
                        name={employeeName}
                        src={`http://localhost:3001/image/${deleteId}`}
                        alt="Employee"
                      />
                    ) : (
                      "No image"
                    )}
                  </WrapItem>
                </Wrap>
              </Center>
              <br />
              Are you sure you want to delete this record? It will be removed
              permanently.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteModalClose}>
                No
              </Button>
              <Button colorScheme="red" ml={3} onClick={deleteEmployees}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <br />
        <br />
        <div className="tableEmployees">
          {employeesList.length > 0 ? (
            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Age</Th>
                    <Th>City</Th>
                    <Th>Charge</Th>
                    <Th>Years</Th>
                    <Th>Date Register</Th>
                    <Th>Photo</Th>
                    <Th>Edit</Th>
                    <Th>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {employeesList.map((employee, index) => (
                    <Tr key={index}>
                      <Td>{employee.name}</Td>
                      <Td>{employee.age}</Td>
                      <Td>{employee.city}</Td>
                      <Td>{employee.charge}</Td>
                      <Td>{employee.years}</Td>
                      <Td>{employee.dateRegister.slice(0, -14)}</Td>
                      <Td>
                        <Wrap>
                          <WrapItem>
                            {employee.image ? (
                              <Avatar
                                size="md"
                                name={employee.name}
                                src={`http://localhost:3001/image/${employee.idEmployee}`}
                                alt="Employee"
                              />
                            ) : (
                              "No image"
                            )}
                          </WrapItem>
                        </Wrap>
                      </Td>
                      <Td>
                        <IconButton
                          isRound={true}
                          colorScheme="green"
                          aria-label="Edit employee"
                          icon={<EditIcon />}
                          onClick={() => {
                            setUpdateId(employee.idEmployee); // Set the ID of the employee to update
                            setEmployeeId(employee.idEmployee);
                            setEmployeeName(employee.name);
                            setEmployeeAge(employee.age);
                            setEmployeeCity(employee.city);
                            setEmployeeCharge(employee.charge);
                            setEmployeeYears(employee.years);
                            setEmployeeImage(employee.image);
                            onUpdateModalOpen(); // Open the delete confirmation modal
                          }}
                        />
                      </Td>
                      <Td>
                        <IconButton
                          isRound={true}
                          colorScheme="red"
                          aria-label="Delete employee"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            setDeleteId(employee.idEmployee); // Set the ID of the employee to delete
                            setEmployeeName(employee.name);
                            setEmployeeImageDelete(employee.image);
                            onDeleteModalOpen(); // Open the delete confirmation modal
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Age</Th>
                    <Th>City</Th>
                    <Th>Charge</Th>
                    <Th>Years</Th>
                    <Th>Date Register</Th>
                    <Th>Image</Th>
                    <Th>Edit</Th>
                    <Th>Delete</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Alert
                status="error"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
                width="500px"
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  No Registered Employees
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  At the moment there are no employees registered.
                </AlertDescription>
              </Alert>
            </Box>
          )}
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
