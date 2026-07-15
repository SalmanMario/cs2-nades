import {Menubar, MenubarMenu} from "@/components/ui/menubar";
import React, {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Search} from "lucide-react";
import DialogSearch from "@/components/DialogSearch";

export default function FrontendNavbarComponent() {
    const navigate = useNavigate();
    const [showSearchDialog, setShowSearchDialog] = useState(false);

    const goToHome = () => {
        navigate({ to: "/" });
    };

    return (
        <div>
            <Menubar className="mb-5 h-20">
                <MenubarMenu className="relative flex items-center w-full">
                    <h1
                        onClick={goToHome}
                        className="absolute left-1/2 -translate-x-1/2 font-bold text-5xl cursor-pointer"
                    >
                        CS2 Nades
                    </h1>
                    <InputGroup style={{width: 300}} className="ml-auto mr-5">
                        <InputGroupInput
                            name="search"
                            id="search"
                            placeholder=" Search nade..."
                            onClick={() => setShowSearchDialog(true)}
                            readOnly
                        />
                        <InputGroupAddon>
                            <Search/>
                        </InputGroupAddon>
                    </InputGroup>
                </MenubarMenu>
            </Menubar>

            <DialogSearch showSearchDialog={showSearchDialog} setShowSearchDialog={setShowSearchDialog}/>
        </div>
    )
}
