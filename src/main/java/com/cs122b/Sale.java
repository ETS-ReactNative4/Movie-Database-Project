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

@WebServlet(name = "Sale", urlPatterns = {"/sale"})
public class Sale extends HttpServlet {
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
        try {
            Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
            Connection connection = Helper.connection();
            BufferedReader r = request.getReader();
            StringBuilder sbuild = new StringBuilder();
            String param = null;
            while ((param = r.readLine()) != null) {
                sbuild.append(param);
            }
            JSONObject sale = new JSONObject(sbuild.toString());
            sale = Helper.getSalesRecords(connection, sale);
            if(!sale.isEmpty()){
                ret.println(sale);
            }
            else{
                ret.println();
            }
            connection.close();
            ret.flush();
        }catch(Exception e){
            JSONObject error = new JSONObject();
            error.put("error",e);
            ret.println(error);
            ret.flush();
        }
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
