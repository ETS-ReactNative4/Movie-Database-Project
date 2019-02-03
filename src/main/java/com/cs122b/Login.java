package com.cs122b;

import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.util.Date;

@WebServlet(name = "Login", urlPatterns = "/login")
public class Login extends HttpServlet {
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Helper.corsFix(resp,req);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        Helper.corsFix(response, request);
        PrintWriter ret = response.getWriter();
        login(request, ret, response);
    }

    private void login(HttpServletRequest request, PrintWriter ret, HttpServletResponse response) {
        try{
            Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
            Connection connection = Helper.connection();
            BufferedReader r = request.getReader();
            StringBuilder sbuild = new StringBuilder();
            String param = null;
            while((param = r.readLine()) != null){
                sbuild.append(param);
            }
            JSONObject credentials = new JSONObject(sbuild.toString());
            if(Helper.isValidUser(connection, credentials)){
                request.getSession();
                System.out.println("Good");
            }
            else{
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                System.out.println("Bad");
            }
            connection.close();
            ret.println();
            ret.flush();
        }
        catch (Exception e){
            JSONObject error = new JSONObject();
            error.put("error",e);
            ret.println(error);
            ret.flush();
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Helper.corsFix(response, request);
        PrintWriter ret = response.getWriter();
        if(!Helper.isLoggedIn(request,response)){
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        }
        ret.println();
        ret.flush();
    }
}
