package com.cs122b;

import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;

@WebServlet(name = "Login", urlPatterns = "/login")
public class Login extends HttpServlet {
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Helper.corsFix(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        Helper.corsFix(response);
        PrintWriter ret = response.getWriter();
        login(request, ret);
    }

    private void login(HttpServletRequest request, PrintWriter ret) {
        try{
            Class.forName("com.mysql.jdbc.Driver").newInstance();
            Connection connection = Helper.connection();
            BufferedReader r = request.getReader();
            String param = null;
            JSONObject credentials = null;
            while((param = r.readLine()) != null){
                credentials = new JSONObject(param);
            }
            assert credentials != null;
            ret.println(credentials);
            System.out.println(credentials.toString());
            connection.close();
            ret.println(credentials);
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
    }
}
