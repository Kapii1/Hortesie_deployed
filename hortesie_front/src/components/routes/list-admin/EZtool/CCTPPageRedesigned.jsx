import React, {useEffect, useState} from "react";
import {Box, Checkbox, Chip, Fab, IconButton, Paper, Tooltip, Typography} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    ChevronRight as ChevronRightIcon,
    Description as DescriptionIcon,
    Download as DownloadIcon,
    Folder as FolderIcon,
    FolderOpen as FolderOpenIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon
} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import ImportFile from "./Tool";
import Loader from "../Loader";
import {DJANGO_URL} from "../../../../url";
import RepositionableComponent from "../DraggableComponent";
import "./CCTPPageRedesigned.css";

const StyledPaper = styled(Paper)(({theme}) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    color: '#333333',
    padding: theme.spacing(4),
    borderRadius: '20px',
    marginBottom: theme.spacing(3),
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
}));

const TreeItem = styled(Box)(({theme, depth}) => ({
    marginLeft: `${depth * 16}px`,
    marginBottom: theme.spacing(0.5),
    position: 'relative',
    '&::before': depth > 0 ? {
        content: '""',
        position: 'absolute',
        left: '-12px',
        top: '50%',
        width: '12px',
        height: '1px',
        backgroundColor: theme.palette.divider,
        opacity: 0.5,
    } : {},
    '&::after': depth > 0 ? {
        content: '""',
        position: 'absolute',
        left: '-12px',
        top: 0,
        width: '1px',
        height: '50%',
        backgroundColor: theme.palette.divider,
        opacity: 0.5,
    } : {},
}));

const ItemCard = styled(Paper)(({theme, depth, isChecked}) => ({
    padding: theme.spacing(1, 1.5),
    marginBottom: theme.spacing(1),
    borderRadius: '12px',
    border: `1px solid ${isChecked ? '#000000' : 'transparent'}`,
    backgroundColor: isChecked ? 'rgba(0, 0, 0, 0.04)' : theme.palette.background.paper,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        borderColor: '#666666',
    },
    '&::before': isChecked ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #000000, #333333)',
    } : {},
}));

const StatsCard = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #333333 0%, #666666 100%)',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
}));

const CCTPTreeItem = ({item, index, onCheck, onCollapse, isExpanded, hasChildren}) => {
    const getDepthColor = (depth) => {
        const colors = ['#1976d2', '#7b1fa2', '#388e3c', '#f57c00', '#d32f2f'];
        return colors[depth % colors.length];
    };

    const getTypeIcon = (depth) => {
        if (depth === 0) return <DescriptionIcon/>;
        if (hasChildren) return isExpanded ? <FolderOpenIcon/> : <FolderIcon/>;
        return <DescriptionIcon fontSize="small"/>;
    };

    return (
        <TreeItem depth={item.depth}>
            <ItemCard
                elevation={item.isChecked ? 3 : 1}
                depth={item.depth}
                isChecked={item.isChecked}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    {hasChildren && (
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCollapse(index);
                            }}
                            sx={{
                                color: getDepthColor(item.depth),
                                transition: 'transform 0.3s ease',
                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            }}
                        >
                            <ChevronRightIcon/>
                        </IconButton>
                    )}

                    <Checkbox
                        checked={item.isChecked}
                        onChange={onCheck(index)}
                        icon={<RadioButtonUncheckedIcon/>}
                        checkedIcon={<CheckCircleIcon/>}
                        sx={{
                            color: getDepthColor(item.depth),
                            '&.Mui-checked': {
                                color: '#4caf50',
                            },
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />

                    <Box sx={{color: getDepthColor(item.depth), display: 'flex', alignItems: 'center'}}>
                        {getTypeIcon(item.depth)}
                    </Box>

                    <Box flex={1}>
                        <Typography
                            variant={item.depth === 0 ? "h6" : item.depth === 1 ? "subtitle1" : "body2"}
                            sx={{
                                fontWeight: item.depth <= 1 ? 600 : 400,
                                color: item.isChecked ? getDepthColor(item.depth) : 'text.primary',
                                transition: 'color 0.3s ease',
                            }}
                        >
                            {item.label_part && (
                                <Chip
                                    label={item.label_part}
                                    size="small"
                                    sx={{
                                        mr: 1,
                                        backgroundColor: getDepthColor(item.depth),
                                        color: 'white',
                                        fontSize: '0.75rem',
                                    }}
                                />
                            )}
                            {item.title}
                        </Typography>

                        {item.content && typeof item.content === 'string' && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: 'block',
                                    mt: 0.5,
                                    opacity: 0.7,
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {item.content.substring(0, 100)}...
                            </Typography>
                        )}
                    </Box>
                </Box>
            </ItemCard>
        </TreeItem>
    );
};

export default function CCTPPageRedesigned() {
    const [structure, setStructure] = useState([]);
    const [unChecked, setUnChecked] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloadAsked, setDownloadAsked] = useState(false);
    const [shouldReRender, setShouldReRender] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedItems, setExpandedItems] = useState(new Set());

    const handleClickFile = () => {
        const filename = "FICHER_CCTP";
        setLoading(true);
        setDownloadAsked(true);
        fetch(DJANGO_URL + "/cctp_file/", {
            method: "POST",
            body: JSON.stringify({values: unChecked, filename: filename}),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.blob();
            })
            .then(res => forceDownload(res, filename))
            .catch(error => {
                console.error('Error downloading CCTP file:', error);
                setLoading(false);
                setDownloadAsked(false);
                alert('Erreur lors du téléchargement du fichier CCTP. Veuillez réessayer.');
            });
    };

    const forceDownload = (response, filename) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}.docx`);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
        setTimeout(() => {
            setDownloadAsked(false);
        }, 2000);
    };

    useEffect(() => {
        setIsLoading(true);
        fetch(DJANGO_URL + "/cctp_file/", {
            method: "GET",
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(res => {
                parseStructure(res);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching CCTP data:', error);
                setIsLoading(false);
                // Set empty structure to prevent infinite loading
                setStructure([]);
            });
    }, [shouldReRender]);

    const updateChildrenChecked = (dataArray, index, isChecked) => {
        const item = dataArray[index];
        item.isChecked = isChecked;

        for (let i = index + 1; i < dataArray.length; i++) {
            if (dataArray[i].depth <= item.depth) {
                break;
            }
            dataArray[i].isChecked = isChecked;
        }
    };

    const updateChildrenDisplayed = (dataArray, index, isDisplayed) => {
        const item = dataArray[index];

        for (let i = index + 1; i < dataArray.length; i++) {
            if (dataArray[i].depth <= item.depth) {
                break;
            }
            dataArray[i].isDisplayed = isDisplayed;
        }
        return dataArray;
    };

    const handleCheck = (index) => (event) => {
        const isChecked = event.target.checked;
        const checkdata = [...structure];
        updateChildrenChecked(checkdata, index, isChecked);

        const updatedStructure = structure.map((item, i) =>
            i === index ? {...item, isChecked} : item
        );

        setStructure(updatedStructure);
        setUnChecked(updatedStructure.filter((item) => !item.isChecked)
            .map(({title, content}) => ({title, content})));
    };

    const handleCollapse = (index) => {
        const item = structure[index];
        const newExpandedItems = new Set(expandedItems);

        if (newExpandedItems.has(item.uid)) {
            newExpandedItems.delete(item.uid);
        } else {
            newExpandedItems.add(item.uid);
        }

        setExpandedItems(newExpandedItems);

        const checkdata = [...structure];
        const isCurrentlyExpanded = expandedItems.has(item.uid);
        const updatedData = updateChildrenDisplayed(checkdata, index, !isCurrentlyExpanded);
        setStructure(updatedData);
    };

    const parseStructure = (structure) => {
        const initialExpanded = new Set();
        const parsedStructure = structure.map((item, index) => {
            if (index < structure.length - 1 && item.depth < structure[index + 1].depth) {
                item.isChildDisplayed = true;
                initialExpanded.add(item.uid);
            }
            return item;
        });

        setExpandedItems(initialExpanded);
        setStructure(parsedStructure);
    };

    const getStats = () => {
        const total = structure.length;
        const checked = structure.filter(item => item.isChecked).length;
        const progress = total > 0 ? (checked / total) * 100 : 0;

        return {total, checked, progress};
    };

    const hasChildren = (index) => {
        if (index >= structure.length - 1) return false;
        return structure[index].depth < structure[index + 1].depth;
    };


    const stats = getStats();

    return (
        <Box className="cctp-redesigned-container" >
            {/* Header Section */}
            <StyledPaper elevation={0}>
                <Box textAlign="center">
                    <DescriptionIcon sx={{fontSize: 48, mb: 2, opacity: 0.9}}/>
                    <Typography variant="h3" component="h1" gutterBottom sx={{fontWeight: 700}}>
                        Outil CCTP
                    </Typography>

                </Box>
            </StyledPaper>


            {/* Content Section */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)',
                    maxWidth: '50%',
                    margin:"auto"
                }}
            >
                <Box p={3} >
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" py={8}>
                            <Loader loading={isLoading}/>
                        </Box>
                    ) : (
                        <Box >
                            {structure.map((item, index) => {
                                if (!item.isDisplayed) return null;

                                const isExpanded = expandedItems.has(item.uid);
                                const itemHasChildren = hasChildren(index);

                                return (
                                    <CCTPTreeItem
                                        key={item.uid || index}
                                        item={item}
                                        index={index}
                                        onCheck={handleCheck}
                                        onCollapse={handleCollapse}
                                        isExpanded={isExpanded}
                                        hasChildren={itemHasChildren}
                                    />
                                );
                            })}
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Floating Action Button */}
            <RepositionableComponent>
                <Box className="cctp-floating-controls">
                    <Paper
                        elevation={8}
                        sx={{
                            p: 1.5,
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            color: '#333333',
                            maxWidth: '500px',
                        }}
                    >
                        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                            <Typography variant="caption" sx={{ textAlign: 'center', fontWeight: 600 }}>
                                Générer le CCTP
                            </Typography>
                            <Tooltip title="Générer le fichier CCTP" placement="left">
                                <Fab
                                    color="primary"
                                    onClick={handleClickFile}
                                    disabled={loading}
                                    sx={{
                                        background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1976d2 60%, #2196f3 100%)',
                                        }
                                    }}
                                >
                                    <DownloadIcon/>
                                </Fab>
                            </Tooltip>

                            <ImportFile setShouldReRender={setShouldReRender}/>

                            {downloadAsked && (
                                <Box mt={2}>
                                    <Loader loading={loading}/>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </RepositionableComponent>

        </Box>
    );
}