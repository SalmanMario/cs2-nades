import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import React from "react";
import {useAuth} from "@/AuthContext";

export const Route = createFileRoute('/admin/login')({
    component: RouteComponent,
})

function RouteComponent() {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login({email, password});
        navigate({to: '/admin/dashboard'})
    }

    return (
        <form onSubmit={submit}>
            <div className="flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="text-center text-4xl">Login</h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                            <Label htmlFor="password">Password</Label>
                            <Input name="password" id="password" value={password}
                                   onChange={(e) => setPassword(e.target.value)} type="password"/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button type="submit" variant="default" intent="info">Login</Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
    )
}
