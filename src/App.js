import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  styled,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
  addEdge,
} from "reactflow";
import * as uuid from "uuid";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    width: "400px",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function App() {
  const [nodes, setNodes] = useState([
    {
      id: uuid.v4(),
      data: {
        label: "Stepnumber 1",
        index: 1,
        created: "test",
        createDate: new Date(),
        updateDate: new Date(),
        flowNodeType: "",
        flowNodeContent: "",
      
        isStartNode: true,

        "flowNodeSource": [],
        "flowNodeOutputs": [],
      },
      position: { x: 100, y: 100 },
      type: "input",
    },
  ]);
  const [pendingIndex, setPendingIndex] = useState(2);

  const [edges, setEdges] = useState([]);

  const [open, setOpen] = useState(false);
  const [currentnode, setCurrentNode] = useState({});

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

console.log(nodes)

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params) => {
      const source = params.source;
      const sourceindex = nodes.filter((x) => x?.id === source)?.[0]?.data
        ?.index;
      const target = params?.target;
      const targetindex = nodes.filter((x) => x?.id === target)?.[0]?.data
        ?.index;

      if (sourceindex + 1 === targetindex) {
        setNodes((prevNodes) =>
          prevNodes.map((node) => {
            if (node.id === source) {
              const updatedNode = {
                ...node,
                data: {
                  ...node.data,
                  flowNodeOutputs: [...node.data.flowNodeOutputs, target],
                },
              };
              return updatedNode;
            }
            return node;
          })
        );
  
        setNodes((prevNodes) =>
          prevNodes.map((node) => {
            if (node.id === target) {
              const updatedNode = {
                ...node,
                data: {
                  ...node.data,
                  flowNodeSource: [...node.data.flowNodeSource, source],
                },
              };
              return updatedNode;
            }
            return node;
          })
        );
        setEdges((eds) => addEdge(params, eds));
      } else {
        console.log("NOT ABLE TO CONNECT");
      }
    },
    [nodes]
  );

  const addNode = () => {
    const count = nodes.filter(
      (item) => item.data.index === pendingIndex
    ).length;
    const lastNode = nodes[nodes.length - 1];
    let x = 0;
    let y = 0;
    if (x === 0 || y === 0) {
      x = (lastNode?.position?.x || 0) + 100;
      y = (lastNode?.position?.y || 0) + 100;
    }

    if (count < pendingIndex) {
      const newItem = {
        id: uuid.v4(),
        data: {
          label: `Stepnumber ${pendingIndex}`,
          index: pendingIndex,
          created: "test",
          createDate: new Date(),
          updateDate: new Date(),
          flowNodeType: "",
          flowNodeContent: "",
        
          isStartNode: false,
          "flowNodeSource": [],
          "flowNodeOutputs": [],
        },
        position: { x: x, y: y },
        type: "special",
      };
      setNodes([...nodes, newItem]);
    } else {
      const newidnexx = pendingIndex + 1;
      setPendingIndex(pendingIndex + 1);
      const newItem = {
        id: uuid.v4(),
        data: {
          label: `Stepnumber ${newidnexx}`,
          index: newidnexx,
          created: "test",
          createDate: new Date(),
          updateDate: new Date(),
          flowNodeType: "",
          flowNodeContent: "",
        
          isStartNode: false,
          "flowNodeSource": [],
          "flowNodeOutputs": [],
        },
        position: { x: x, y: y },
        type: "special",
      };
      setNodes([...nodes, newItem]);
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Update
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={() => {
            setOpen(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent dividers>
          <FormControl fullWidth>
            <InputLabel id='type'>Type</InputLabel>
            <Select
              labelId='type'
              id='type'
              value={
                nodes?.filter((x) => x.id === currentnode?.id)?.[0]?.data
                  ?.flowNodeType || ""
              }
              label='Type'
              onChange={(e) => {
                const updatedNodes = nodes.map((x) =>
                  x.id === currentnode?.id
                    ? {
                        ...x,
                        data: { ...x?.data, flowNodeType: e.target.value },
                      }
                    : x
                );
                setNodes(updatedNodes);
              }}
            >
              <MenuItem value={"text"}>Text</MenuItem>
              <MenuItem value={"list"}>List</MenuItem>
              <MenuItem value={"response"}>Quick Response</MenuItem>
              <MenuItem value={"paragraph"}>Paragraph</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              value={
                nodes?.filter((x) => x.id === currentnode?.id)?.[0]?.data
                  ?.flowNodeContent || ""
              }
              fullWidth
              sx={{ marginTop: 1 }}
              onChange={(e) => {
                const updatedNodes = nodes.map((x) =>
                  x.id === currentnode?.id
                    ? {
                        ...x,
                        data: {
                          ...x?.data,
                          flowNodeContent: e.target.value,
                          label: e.target.value,
                        },
                      }
                    : x
                );
                setNodes(updatedNodes);
              }}
              variant='outlined'
              placeholder='Input'
            />
          </FormControl>
        </DialogContent>
      </BootstrapDialog>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(e, node) => {
          setOpen(true);
          setCurrentNode(node);
        }}
      >
        <Background />
        <Controls />
        <MiniMap nodeColor={"#9c27b0"} />
      </ReactFlow>
      <button
        onClick={addNode}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          padding: "10px 20px",
          background: "#007BFF",
          color: "#FFF",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Node
      </button>
    </div>
  );
}

export default App;
