import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  CreateCompany,
  GetAllCompanys,
  GetCompanybycode,
  RemoveCompany,
  UpdateCompany,
} from "../Redux/ActionCreater";
import { connect, useDispatch, useSelector } from "react-redux";
import { OpenPopup } from "../Redux/Action";
import CloseIcon from "@mui/icons-material/Close";

const Company = (props) => {
  const columns = [
    { id: "id", name: "Id" },
    { id: "name", name: "Name" },
    { id: "email", name: "Email" },
    { id: "phone", name: "Phone" },
    { id: "action", name: "Action" },
  ];

  const { register, handleSubmit, formState: { errors}, } = useForm ();
 

  const dispatch = useDispatch();

  const [id, idchange] = useState(0);
  const [name, namechange] = useState("");
  const [email, emailchange] = useState("");
  const [phone, phonechange] = useState("");
  const [open, openchange] = useState(false);

  const [rowperpage, rowperpagechange] = useState(20);
  const [page, pagechange] = useState(0);

  const [isedit, iseditchange] = useState(false);
  const [title, titlechange] = useState("Create Data");

  const editobj = useSelector((state) => state.company.companyobj);

  useEffect(() => {
    if (Object.keys(editobj).length > 0) {
      idchange(editobj.id);
      namechange(editobj.name);
      emailchange(editobj.email);
      phonechange(editobj.phone);
    } else {
      clearstate();
    }
  }, [editobj]);

  const handlepagechange = (newpage) => {
    pagechange(newpage);
  };

  const handlerowperpagechange = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const functionadd = () => {
    iseditchange(false);
    titlechange("Create Data");
    openpopup();
  };
  const closepopup = () => {
    openchange(false);
  };
  const openpopup = () => {
    openchange(true);
    clearstate();
    dispatch(OpenPopup());
  };
  const handlesubmit = (e) => {
    if (e && e.preventDefault){
      e.preventDefault();
      const _obj = { id, name, email, phone };
      if (isedit) {
        dispatch(UpdateCompany(_obj));
      } else {
        dispatch(CreateCompany(_obj));
      }
      closepopup();
    }
  };

  const handleEdit = (code) => {
    iseditchange(true);
    titlechange("Update Data");
    openchange(true);
    dispatch(GetCompanybycode(code));
  };

  const handleRemove = (code) => {
    if (window.confirm("Do you want to remove?")) {
      dispatch(RemoveCompany(code));
    }
  };

  const clearstate = () => {
    idchange(0);
    namechange("");
    emailchange("");
    phonechange("");
  };
  useEffect(() => {
    props.loadcompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return props.companystate.isloading ? (
    <div>
      <h2>Loading.....</h2>
    </div>
  ) : props.companystate.errormessage ? (
    <div>
      <h2>{props.companystate.errormessage}</h2>
    </div>
  ) : (
    <div>
      <Paper sx={{ margin: "1%" }}>
        <div style={{ margin: "1%" }}>
          <Button onClick={functionadd} variant="contained">
            Add New (+)
          </Button>
        </div>
        <div style={{ margin: "1%" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "midnightblue" }}>
                  {columns.map((column) => (
                    <TableCell key={column.id} style={{ color: "white" }}>
                      {column.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.companystate.companylist &&
                  props.companystate.companylist
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((row, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.phone}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => {
                                handleEdit(row.id);
                              }}
                              variant="contained"
                              color="primary"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => {
                                handleRemove(row.id);
                              }}
                              variant="contained"
                              color="error"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[2, 5, 10, 20]}
            rowsPerPage={rowperpage}
            page={page}
            count={props.companystate.companylist.length}
            component={"div"}
            onPageChange={handlepagechange}
            onRowsPerPageChange={handlerowperpagechange}
          ></TablePagination>
        </div>
      </Paper>

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle>
          <span>{title}</span>
          <IconButton style={{ float: "right" }} onClick={closepopup}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handlesubmit)}>
            <Stack spacing={2} margin={2}>
              <TextField
                required
                error={errors.name}
                value={name}
                onChange={(e) => {
                  namechange(e.target.value);
                }}
                variant="outlined"
                label="Name" {...register('name')}
              ></TextField>
              <TextField
                required
                error={errors.email}
                value={email}
                onChange={(e) => {
                  emailchange(e.target.value);
                }}
                variant="outlined"
                label="Email" {...register('email')}
              ></TextField>
              <TextField
                required
                error={errors.phone}
                value={phone}
                onChange={(e) => {
                  phonechange(e.target.value);
                }}
                variant="outlined"
                label="Phone" {...register('phone')}
              ></TextField>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Stack>
          </form>
          </DialogContent>
      </Dialog>
    </div>
  );
};

const mapStatetoProps = (state) => {
  return {
    companystate: state.company,
  };
};

const mapDispatchtoProps = (dispatch) => {
  return {
    loadcompany: () => dispatch(GetAllCompanys()),
  };
};

export default connect(mapStatetoProps, mapDispatchtoProps)(Company);
